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

    return reportcard;
  },

  storeSeverity: (component, severity, reportcard) => {
    for (const damaged of reportcard.damages) {
      if (damaged.component === component) {
        damaged.severity = severity;
        break;
      }
    }

    return reportcard;
  }
};
