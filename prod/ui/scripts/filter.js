d3.select("#filterForm").select("li").addEventListener("click", function(e, i) {
    // When the list item is clicked, remove the word from the query list and delete the data
    if (this.checked === false) {
        params[this.name] = this.value
        this.setAttribute("checked", "checked")
        this.checked = true
    } else {
        return false
    }
})