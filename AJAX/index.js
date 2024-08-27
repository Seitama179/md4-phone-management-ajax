
function addNewSmartPhone() {
    //lấy dữ liệu từ form html
    let producer = $('#producer').val();
    let model = $('#model').val();
    let price = $('#price').val();
    let newSmartphone = {
        producer: producer,
        model: model,
        price: price
    };
    // gọi phương thức ajax
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(newSmartphone),
        //tên API
        url: "http://localhost:8080/api/smartphones",
        //xử lý khi thành công
        success: successHandler

    });
    //chặn sự kiện mặc định của thẻ
    event.preventDefault();
}

function successHandler() {
    $.ajax({
        type: "GET",
        //tên API
        url: "http://localhost:8080/api/smartphones",
        //xử lý khi thành công
        success: function (data) {
            // hiển thị danh sách ở đây
            let content = '    <table id="display-list"  border="1"><tr>\n' +
                '        <th>Producer</td>\n' +
                '        <th>Model</td>\n' +
                '        <th>Price</td>\n' +
                '        <th>Update</td>\n' +
                '        <th>Delete</td>\n' +
                '    </tr>';
            for (let i = 0; i < data.length; i++) {
                content += getSmartphone(data[i]);
            }
            content += "</table>"
            document.getElementById('smartphoneList').innerHTML = content;
            document.getElementById('smartphoneList').style.display = "block";
            document.getElementById('add-smartphone').style.display = "none";
            document.getElementById('display-create').style.display = "block";
            document.getElementById('title').style.display = "block";
        }
    });
}

function displayFormCreate() {
    document.getElementById('smartphoneList').style.display = "none";
    document.getElementById('add-smartphone').style.display = "block";
    document.getElementById('display-create').style.display = "none";
    document.getElementById('update-smartphone').style.display = "none";
    document.getElementById('title').style.display = "none";

}

function getSmartphone(smartphone) {
    return `<tr><td >${smartphone.producer}</td><td >${smartphone.model}</td><td >${smartphone.price}</td>` +
        `<td class="btn"><button class="updateSmartphone" onclick="showUpdateForm(${smartphone.id}, '${smartphone.producer}', '${smartphone.model}', ${smartphone.price})">Update</button></td>` +
        `<td class="btn"><button class="deleteSmartphone" onclick="deleteSmartphone(${smartphone.id})">Delete</button></td></tr>`;
}

function deleteSmartphone(id) {
    if (confirm("Confirm Delete?")) {
        $.ajax({
            type: "DELETE",
            //tên API
            url: `http://localhost:8080/api/smartphones/${id}`,
            //xử lý khi thành công
            success: successHandler
        });
    }
}

function showUpdateForm(id, producer, model, price) {
    document.getElementById('update-smartphone').style.display = "block";
    document.getElementById('smartphoneList').style.display = "none";
    document.getElementById('add-smartphone').style.display = "none";
    document.getElementById('display-create').style.display = "none";

    // Pre-fill the form with current details
    $('#update-producer').val(producer);
    $('#update-model').val(model);
    $('#update-price').val(price);

    // Store the smartphone id for use in the update function
    $('#update-smartphone').data('id', id);
}

function updateSmartphone(id) {
// Prevent the default form submission
    event.preventDefault();

    // Get the updated values
    let id1 = $('#update-smartphone').data('id');
    let producer = $('#update-producer').val();
    let model = $('#update-model').val();
    let price = $('#update-price').val();

    let updatedSmartphone = {
        producer: producer,
        model: model,
        price: price
    };
    console.log(updatedSmartphone);

    // Send the update request to the backend
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "PUT",
        url: `http://localhost:8080/api/smartphones/${id1}/update`,
        data: JSON.stringify(updatedSmartphone, id1),
        success: function() {
            // Hide the update form and reload the smartphone list
            document.getElementById('update-smartphone').style.display = "none";
            successHandler();
        }
    });
    // event.preventDefault();
}