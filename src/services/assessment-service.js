export default {
  registerDamage: (component, isDamaged, reportcard) => {
    if (reportcard.damages) {
      // ReportCard.damages has been initialized as an array
      if (isDamaged === 'Yes') {
        // 'Yes' button selected
        reportcard.damages.push({
          component: component,
          severity: null
        });
      } else {
        // 'No' button selected after 'Yes'
        for (let i = 0; i < reportcard.damages.length; i += 1) {
          if (reportcard.damages[i].component === component) {
            reportcard.damages.splice(i, 1);
          }
        }

        // Also check for any descriptions, and remove
        exports.default.clearDamageDescription(component, reportcard);
      }
    } else {
      // ReportCard.damages not initialized yet
      if (isDamaged === 'Yes') {
        // 'Yes' button selected
        reportcard.damages = [{
          component: component,
          severity: null
        }];
      }
    }
  },

  storeSeverity: (component, severity, reportcard) => {
    for (const damaged of reportcard.damages) {
      if (damaged.component === component) {
        damaged.severity = severity;
        break;
      }
    }
  },

  storeDamageDescription: (component, text, reportcard) => {
    let hasExistingText;

    if (reportcard.damageDescriptions.length) {
      for (const description of reportcard.damageDescriptions) {
        if (description.hasOwnProperty(component)) {
          description.roof = text;
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

  clearDamageDescription: (component, reportcard) => {
    for (let i = 0; i < reportcard.damageDescriptions.length; i += 1) {
      if (reportcard.damageDescriptions[i].hasOwnProperty(component)) {
        reportcard.damageDescriptions.splice(i, 1);
      }
    }
  }
};
