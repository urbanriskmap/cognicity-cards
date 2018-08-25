export default {
  fetchPreviousInputs: (component, reportcard) => {
    if (reportcard.damages[component] !== null) {
      // Previously reported Yes or No
      if (reportcard.damages[component] === 0) {
        // Reported No
        return {severity: 0, description: null};
      } else {
        // Reported Yes
        let text;
        if (reportcard.damageDescriptions.length) {
          for (const description of reportcard.damageDescriptions) {
            if (description.hasOwnProperty(component)) {
              text = description[component];
            }
          }
        }
        return {
          severity: reportcard.damages[component],
          description: text
        };
      }
    } else {
      // Not reported yet, first prompt
      return {severity: null, description: null};
    }
  },

  checkDamage: (component, isDamaged, reportcard) => {
    if (isDamaged === 'No') {
      // Set damages for component as 0
      reportcard.damages[component] = 0;

      exports.default.clearDamageDescriptions(component, reportcard);
    } else {
      // Clicked 'Yes', set damages as null to disable NEXT button
      // Will be enabled when severity is selected
      reportcard.damages[component] = null;
    }
  },

  storeSeverity: (component, severity, reportcard) => {
    reportcard.damages[component] = severity;
  },

  storeDamageDescription: (component, text, reportcard) => {
    let hasExistingText;

    if (reportcard.damageDescriptions.length) {
      for (const description of reportcard.damageDescriptions) {
        if (description.hasOwnProperty(component)) {
          description[component] = text;
          hasExistingText = true;
        }
      }
    }

    if (!hasExistingText) {
      const descriptionObject = {};
      descriptionObject[component] = text;

      reportcard.damageDescriptions.push(descriptionObject);
    }
  },

  clearDamageDescriptions: (component, reportcard) => {
    for (let i = 0; i < reportcard.damageDescriptions.length; i += 1) {
      if (reportcard.damageDescriptions[i].hasOwnProperty(component)) {
        reportcard.damageDescriptions.splice(i, 1);
      }
    }
  }
};
