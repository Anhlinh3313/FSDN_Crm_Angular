export class FilterUtil {
    static gbFilterFiled(row, gbFilter, columns) {
        let isInFilter = false;
        let noFilter = true;

        if (gbFilter) {
            gbFilter = gbFilter.toString().toLowerCase();
            for (var index = 0; index < columns.length; index++) {
                let columnName = columns[index];
                let rowValue: String;
                let arr = columnName.split(".");

                if (arr.length == 1) {
                    if (!row[columnName]) {
                        continue;
                    }

                    noFilter = false;
                    rowValue = row[columnName].toString().toLowerCase();
                } else if (arr.length > 1) {
                   try {
                    let element = row[arr[0]][arr[1]];
                    if (!element) {
                        continue;
                    }

                    noFilter = false;
                    rowValue = element.toString().toLowerCase();
                   } catch (error) {
                    continue;
                   }
                }

                if (rowValue.includes(gbFilter)) {
                    isInFilter = true;
                }
            }
        }

        if (noFilter) { isInFilter = true; }

        return isInFilter;
    }

    static filterField(row, filter) {
        let isInFilter = false;
        let noFilter = true;

        for (var columnName in filter) {
            if (row[columnName] == null) {
                return;
            }
            noFilter = false;
            let rowValue: String = row[columnName].toString().toLowerCase();
            let filterMatchMode: String = filter[columnName].matchMode;
            if (filterMatchMode.includes("contains") && rowValue.includes(filter[columnName].value.toLowerCase())) {
                isInFilter = true;
            } else if (filterMatchMode.includes("startsWith") && rowValue.startsWith(filter[columnName].value.toLowerCase())) {
                isInFilter = true;
            } else if (filterMatchMode.includes("in") && filter[columnName].value.includes(rowValue)) {
                isInFilter = true;
            }
        }

        if (noFilter) { isInFilter = true; }

        return isInFilter;
    }

    static compareField(rowA, rowB, field: string): number {
        if (rowA[field] == null) return 1; // on considère les éléments null les plus petits
        if (typeof rowA[field] === 'string') {
            return rowA[field].localeCompare(rowB[field]);
        }
        if (typeof rowA[field] === 'number') {
            if (rowA[field] > rowB[field]) return 1;
            else return -1;
        }
    }
}