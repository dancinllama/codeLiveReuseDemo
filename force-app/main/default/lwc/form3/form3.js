import { LightningElement, track, api } from "lwc";

const STEPS = [
    {
      label: "Contact Information",
      fields: [
        { name: "FirstName", requiredLabel: "First Name" },
        { name: "LastName", requiredLabel: "Last Name" },
        { name: "Phone", requiredLabel: "Phone" },
        { name: "MobilePhone", requiredLabel: "Mobile Phone" },
        { name: "Email", requiredLabel: "Email" },
        { name: "Title" },
        { name: "Company", requiredLabel: "Company" },
        { name: "Website" }
      ]
    },
    {
      label: "Current Address",
      fields: [
        {
          name: "Address",
          requiredLabel: "Former address",
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
    },
    {
      label: "New Address",
      fields: [
        {
          name: "Address",
          requiredLabel: "New address",
          isCustomAddress: true,
          addressFields: {
            city: "City__c",
            province: "State__c",
            postalCode: "PostalCode__c",
            street: "Street__c",
            country: "Country__c"
          },
          addressFieldLabels: {
            province: "state / province",
            postalCode: "postal code"
          }
        }
      ]
    }
  ];

export default class ResellerForm extends LightningElement {
  @track lead = {};
  @track steps = STEPS;
  @track currentStep = 0;
  @track errors;
  @api recordId;

  handleRecordChange(event) {
    this.lead = Object.assign(this.lead, event.detail);
  }

  handleFieldChange(event) {
    let field = event.currentTarget.dataset.field;
    this.lead[field] = event.detail.value;
  }

  copyAddress(event) {
    event.preventDefault();
    event.stopPropagation();

    let formerAddrFields = this.steps.find(
      field => field.label === "Current Address"
    ).fields[0].addressFields;
    let newAddrFields = this.steps
      .find(field => field.label === "New Address")
      .fields.find(field => field.name === "Address").addressFields;

    Object.entries(formerAddrFields).forEach(([key, value]) => {
      let formerAddrFieldValue = this.lead[value];
      let newAddrField = newAddrFields[key];
      this.lead[newAddrField] = formerAddrFieldValue;
    });
  }

  handleError(event) {
    this.submitting = false;
    let errors = [];
    errors.push(event.detail.detail);
    this.errors = errors;
  }

  get hasNext() {
    return 0 <= this.currentStep && this.currentStep < this.steps.length - 1;
  }

  get hasPrev() {
    return 1 <= this.currentStep;
  }

  get fields() {
    return this.steps[this.currentStep].fields;
  }

  get displayCopyAddress() {
    return this.currentStep === 2;
  }

  get displaySubmit() {
    return this.currentStep === 2;
  }

  next(event) {
    event.preventDefault();
    event.stopPropagation();
    this.errors = this.validateFields(this.fields);
    if (!this.errors.length) {
      this.template.querySelector("c-path").handleNext();
    }
  }

  validateFields(fields) {
    //First, check for requiredness of fields.
    let errors = [];
    fields.forEach(field => {
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
        } else if (!this.lead[field.name]) {
          errors.push(field.requiredLabel + " is required.");
        }
      }
    });
    return errors;
  }

  handleSubmit(event) {
    event.preventDefault();
    this.errors = this.validateAllFields(this.steps);
    if (!this.errors.length) {
      this.submitting = true;
      this.template
        .querySelector("lightning-record-edit-form")
        .submit(this.lead);
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
          } else if (!this.lead[field.name]) {
            errors.push(field.requiredLabel + " is required.");
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