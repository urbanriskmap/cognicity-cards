export default {
  fetchPreviousInputs: (component, reportcard) => {
    if (reportcard.damageDescriptions.length) {
      for (const description of reportcard.damageDescriptions) {
        if (description.hasOwnProperty(component)) {
          return description[component];
        }
      }
    }

    return null;
  },

  checkDamage: (component, isDamaged, reportcard) => {
    if (isDamaged === 0) {
      exports.default.clearDamages(component, reportcard);
    } else {
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

  clearDamages: (component, reportcard) => {
    reportcard.damages[component] = 0;

    for (let i = 0; i < reportcard.damageDescriptions.length; i += 1) {
      if (reportcard.damageDescriptions[i].hasOwnProperty(component)) {
        reportcard.damageDescriptions.splice(i, 1);
      }
    }
  }
};
