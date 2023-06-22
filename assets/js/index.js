$("#add_user").submit(function (event) {
  alert("Data Inserted Successfully!");
});

$("#update_user").submit(function (event) {
  event.preventDefault();

  var unindexed_array = $(this).serializeArray();
  var data = {};

  $.map(unindexed_array, function (n, i) {
    data[n["name"]] = n["value"];
  });

  var request = {
    url: `http://localhost:5000/api/users/${data.id}`,
    method: "PUT",
    data: data,
  };

  $.ajax(request).done(function (response) {
    alert("Data Updated Successfully!");
  });
});

if (window.location.pathname === "/") {
  $ondelete = $(".table tbody td a.delete");
  $ondelete.click(function () {
    var id = $(this).attr("data-id");

    var request = {
      url: `http://localhost:5000/api/users/${id}`,
      method: "DELETE",
    };

    if (confirm("Do you really want to delete this record?")) {
      $.ajax(request).done(function (response) {
        alert("Data Deleted Successfully!");
        location.reload();
      });
    }
  });

  $("#search-form").submit(function (event) {
    event.preventDefault();

    var searchQuery = $("#search-input").val().toLowerCase();

    $.ajax({
      url: "/api/users/search",
      method: "POST",
      data: { searchQuery: searchQuery },
      success: function (response) {
        // Update the table body with the search results
        var tableBody = $("#user-table-body");
        tableBody.empty();

        if (response.length === 0) {
          // Display a message if no results found
          tableBody.append("<tr><td colspan='6'>No results found</td></tr>");
        } else {
          // Iterate over the search results and add rows to the table
          response.forEach(function (user) {
            var row = "<tr>";
            row += "<td>" + user.id + "</td>";
            row += "<td>" + user.title + "</td>";
            row += "<td>" + user.article_body + "</td>";
            row += "<td>" + user.author + "</td>";
            row += "<td>" + user.publish_date + "</td>";
            row += "<td>" + user.category + "</td>";
            row += "</tr>";
            tableBody.append(row);
          });
        }
      },
      error: function (xhr, status, error) {
        console.error(error);
        alert("An error occurred while searching users");
      },
    });
  });
}
