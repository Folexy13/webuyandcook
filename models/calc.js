module.exports =
function OrderCalc(order) {
        this.schema= order || ''
        this.generateSchemaArray = function () {
        var arr = []
        for (var id in this.schema) {
            arr.push(this.schema[id])
        }
        return arr
    }
    }