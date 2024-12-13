export function TableDataFilter(data, requiredColumns) {
    return data.map((item) => {
      const filteredItem = {};
      requiredColumns.forEach((column) => {
        if (item.hasOwnProperty(column)) {
          filteredItem[column] = item[column];
        }
      });
      return filteredItem;
    });
  }
  