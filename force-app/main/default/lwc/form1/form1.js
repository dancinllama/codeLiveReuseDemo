import { LightningElement, track, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

import errorTitle from '@salesforce/label/c.Error_Title';
import requestInformation from '@salesforce/label/c.Request_Information';

const STEPS = [
  {
    label: "Address",
    fields: [
      {
        name: "Address",
        requiredLabel: "Address",
        isCustomAddress: true,
        addressFields: {
          city: "City",
          province: "StateCode",
          postalCode: "PostalCode",
          street: "Street",
          country: "CountryCode"
        },
        addressFieldLabels: {
          province: "state / province",
          postalCode: "postal code"
        }
      }
    ]
  }
];

export default class DealRegForm extends NavigationMixin(LightningElement) {
  @track lead = {};
  @track steps = STEPS;
  @track currentStep = 0;
  @track errors;
  @api recordId;

  label = {
      requestInformation,
      errorTitle
  };

  handleRecordChange(event) {
    this.lead = Object.assign(this.lead, event.detail);
    this.leadSaved = false;
  }

  handleFieldChange(event) {
    let field = event.currentTarget.dataset.field;
    this.lead[field] = event.detail.value;
  }

  handleError(event) {
    this.submitting = false;
    let errors = [];
    errors.push(event.detail.detail);
    this.errors = errors;
  }

  get fields() {
    return this.steps[this.currentStep].fields;
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    this.errors = this.validateAllFields(this.steps);
    if(!this.errors){
        alert('Enjoy the reading material');
    }
  }

  validateAllFields(steps) {
    //First, check for requiredness of fields.
    let errors = [];
    steps.forEach(step => {
      step.fields.forEach(field => {
        if (field.requiredLabel) {
          if (field.addressFields) {
            Object.entries(field.addressFields).forEach(([key, val]) => {
              if (!this.lead[val]) {
                let label =
                  field.addressFieldLabels && field.addressFieldLabels[key]
                    ? field.addressFieldLabels[key]
                    : key;
                errors.push(
                  field.requiredLabel + " " + label + " is required."
                );
              }
            });
          }
        }
      });
    });

    return errors;
  }

  prev(event) {
    event.preventDefault();
    event.stopPropagation();
    this.errors = this.validateFields(this.fields);
    if (!this.errors.length) {
      this.template.querySelector("c-path").handlePrev();
    }
  }

  get stepLabel() {
    return this.steps[this.currentStep].label;
  }

  handleStepChange(event) {
    this.errors = [];
    this.currentStep = event.detail;
  }
}