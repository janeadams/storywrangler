document.getElementById("filterForm")getElementsByTagName("li").addEventListener("click", function(e, i) {
    console.log(`Clicked ${this.name} with value ${this.value}`)
    // When the list item is clicked, remove the word from the query list and delete the data
    if (this.checked === false) {
        params[this.name] = this.value
        console.log(`Set params[${this.name}] to value ${params[this.name]}`)
        this.setAttribute("checked", "checked")
        this.checked = true
    } else {
        return false
    }
})