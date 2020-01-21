$(document).ready(function () {
    console.log("loaded index page");
    loadArticles();

    $(document).on("click", "#scrape-button", function () {
        let id = $(this).attr("data-id");

        $.ajax({
            method: "GET",
            url: "/scrape",
            data: {
                saved: true
            }
        }).done(function (data) {
            window.location = "/";
        });
    });

    $(document).on("click", ".save-button", function () {
        let id = $(this).attr("data-id");

        $.ajax({
            method: "POST",
            url: "/save/" + id,
            data: {
                saved: true
            }
        }).done(function (data) {
            window.location = "/";
        });
    });
});

// Load Unsaved Articles from DB
function loadArticles() {
    $.getJSON("/articles", function (data) {
        console.log("fetching articles...")
        for (let i = 0; i < data.length; i++) {
            let card = $("<div>", { id: data[i]._id, "class": "card" });

            let cardBody = $("<div>", { "class": "card-body" });

            let cardTitle = $("<div>");
            let link = $("<a>", { "href": data[i].link })
            let title = $("<h5>").text(data[i].title);
            link.append(title);
            cardTitle.append(link);
            cardBody.append(cardTitle);

            let description = $("<p>", { "class": "card-text" }).text(data[i].description + "...");
            cardBody.append(description);

            let saveButton = $("<button>", { "data-id": data[i]._id, "class": "save-button button" }).text("Save This!");
            cardBody.append(saveButton);

            card.append(cardBody);

            $("#scraped-articles").append(card);
        }
    });
    console.log("fetched articles")
}