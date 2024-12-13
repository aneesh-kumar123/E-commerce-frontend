function camelCaseToTitleCase(camelCaseString) {
    let result = '';
    for (let i = 0; i < camelCaseString.length; i++) {
      if (i === 0) {
        result += camelCaseString[i].toUpperCase();  
      } else if (camelCaseString[i] === camelCaseString[i].toUpperCase()) {
        result += ' ' + camelCaseString[i];  
      } else {
        result += camelCaseString[i];
      }
    }
    return result;
  }
  
  
  export default camelCaseToTitleCase;  