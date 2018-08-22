export default (component, severity, reportcard) => {
  let hasComponentDamage = false;

  if (reportcard.damages.length) {
    for (const damaged of reportcard.damages) {
      if (damaged.component === component) {
        damaged.severity = severity;
        hasComponentDamage = true;
        break;
      }
    }
  }

  if (!hasComponentDamage) {
    reportcard.damages.push({
      component: component,
      severity: severity
    });
  }

  return reportcard;
};
