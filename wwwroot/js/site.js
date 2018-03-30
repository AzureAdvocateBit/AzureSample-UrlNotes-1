﻿function JSONTable(tableObject) {
    this.table = tableObject

    this.toJSON = function () {
        tableHeaderArray = []
        tableHeader = this.table.find("th")
        for (var hc = 0; hc < tableHeader.length; hc++) {
            tableHeaderArray.push($(tableHeader[hc]).text())
        }

        var tableJsonObjectList = []

        tableRows = this.table.find("tr").has("td")
        for (var rc = 0; rc < tableRows.length; rc++) {
            tableJsonObject = {}
            tableRow = $(tableRows[rc]).children()
            for (var cc = 0; cc < tableRow.length; cc++) {
                tableJsonObject[tableHeaderArray[cc]] = tableRow[cc].innerText
            }
            tableJsonObjectList.push(tableJsonObject)
        }

        return tableJsonObjectList
    }

    this.tableJSON = this.toJSON()
    this.tableFullJSON = this.toJSON()
    this.isTableFiltered = false

    this.clearTable = function () {
        this.table.find("tr").has("td").remove()
    }

    this.fromJSON = function (jsonSourceData = this.tableJSON, selectedCollection, setFullJSON = true) {
        if (jsonSourceData.length == 0) {
            this.clearTable()
            return
        }

        var staticHeaders = ["Edit", "Delete"]
        rootTableObject = this.table.clone().empty().append('<thead><tr></tr></thead>')
        rootHeaderRow = rootTableObject.find('tr')
        tableHeaderKeyArray = []
        tableHeaderKeys = Object.keys(jsonSourceData[0])
        tableHeaderKeys.unshift("Edit", "Delete")

        for (var kc = 0; kc < tableHeaderKeys.length; kc++)
        {
            tableHeaderKeyArray.push(tableHeaderKeys[kc])
            $(rootHeaderRow).append('<th>' + tableHeaderKeys[kc] + '</th>')
        }

        rootTableObject.append("<tbody></tbody>")
        for (var jr = 0; jr < jsonSourceData.length; jr++) {
            tableDataRow = $('<tr></tr>')

            for (var ki = 0; ki < tableHeaderKeyArray.length; ki++) {

                switch (tableHeaderKeyArray[ki])
                {
                    case "name":
                        tableDataRow.append("<td><a href=" + jsonSourceData[jr]['url'] + ">" + jsonSourceData[jr]['name'] + "</a>")
                        break;
                    case "Edit":
                        console.log(tableHeaderKeyArray[ki])
                        tableDataRow.append("<td><a href=Edit/" + selectedCollection + "/" + jsonSourceData[jr]['id'] + ">Edit</a>")
                        break;
                    case "Delete":
                        tableDataRow.append("<td><a href=/Index/?handler=Delete&recordId=" + jsonSourceData[jr]['id'] + "&collection=" + selectedCollection +">Delete</a>")// '<td>' + jsonSourceData[jr][tableHeaderKeyArray[ki]])
                        break;

                    default:
                        tableDataRow.append('<td>' + jsonSourceData[jr][tableHeaderKeyArray[ki]])
                }
            }
            rootTableObject.find("tbody").append(tableDataRow)
        }
        this.table.html(rootTableObject[0].innerHTML)
        this.tableJSON = jsonSourceData
        if (setFullJSON) {
            this.tableFullJSON = jsonSourceData
        }
    }

    this.limitJSON = function (page = 0, limit = 25, updateTableDirectly = false, inputJSON = this.tableJSON) {
        return inputJSON.slice(page * limit, (page * limit) + limit)
    }

    this.filter = function (searchQuery) {
        this.isTableFiltered = true
        resultList = []
        searchQuery = searchQuery.toLowerCase()
        sourceTableJSON = this.tableFullJSON
        sourceTableJSONLength = sourceTableJSON.length
        sourceTableKeys = Object.keys(sourceTableJSON[0])
        sourceTableKeysLength = sourceTableKeys.length
        searchQuerySplit = searchQuery.split(" ")
        searchQuerySplitLength = searchQuerySplit.length
        for (fj = 0; fj < sourceTableJSONLength; fj++) {
            tempResultListLength = 0
            for (ql = 0; ql < searchQuerySplitLength; ql++) {
                for (tk = 0; tk < sourceTableKeysLength; tk++) {
                    if (sourceTableJSON[fj][sourceTableKeys[tk]].toLowerCase().indexOf(searchQuerySplit[ql]) != -1) {
                        tempResultListLength++
                        break
                    }
                }
            }
            if ((tempResultListLength == searchQuerySplitLength)) {
                resultList.push(sourceTableJSON[fj])
            }
        }
        if (!searchQuery) {
            this.isTableFiltered = false
            this.tableJSON = this.tableFullJSON
            resultList = this.tableFullJSON

            this.fromJSON(resultList)
        }
        else {
            this.fromJSON(resultList, false)
        }
    }
}













//case "name":
//tableDataRow.append("<td><a href=" + jsonSourceData[jr]['url'] + ">" + jsonSourceData[jr]['name'] + "</a>")// '<td>' + jsonSourceData[jr][tableHeaderKeyArray[ki]])
//                    //case "Edit":
//                    //    tableDataRow.append("<td><a href=Edit/" + selectedCollection + "/" + jsonSourceData[jr]['id'] + ">Edit</a>")// '<td>' + jsonSourceData[jr][tableHeaderKeyArray[ki]])
//                    //case "Delete":
//                    //    tableDataRow.append("<td><a href=Delete/" + selectedCollection + "/" + jsonSourceData[jr]['id'] + ">Delete</a>")// '<td>' + jsonSourceData[jr][tableHeaderKeyArray[ki]])

//                    default:
//tableDataRow.append('<td>' + jsonSourceData[jr][tableHeaderKeyArray[ki]])