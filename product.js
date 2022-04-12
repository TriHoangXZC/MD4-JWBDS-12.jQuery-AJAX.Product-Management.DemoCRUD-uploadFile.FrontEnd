function getAllProduct() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/products',
        success: function (products) {
            let content = '';
            for (let i = 0; i < products.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
        <td>${products[i].name}</td>
        <td>${products[i].price}</td>
        <td>${products[i].description}</td>
        <td><img src="http://localhost:8080/image/${products[i].image}" alt="" height="50"></td>
        <td>${products[i].category == null ? '' : products[i].category.name}</td>
        <td><button class="btn btn-primary" type="button" data-toggle="modal" data-target="#create-product" 
        onclick="showEditProduct(${products[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button class="btn btn-danger" type="button" data-toggle="modal" data-target="#delete-product" 
        onclick="showDeleteProduct(${products[i].id})"><i class="fa fa-trash"></i></button></td>
    </tr>`
            }
            $('#product-list-content').html(content);
        }
    })
}

function showCreateProduct() {
    let title = 'Create Product';
    let footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="createNewProduct()"
                        aria-label="Close" class="close" data-dismiss="modal">Create
                </button>`;
    $('#create-product-title').html(title);
    $('#create-product-footer').html(footer);
    $('#name').val(null);
    $('#price').val(null);
    $('#description').val(null);
    $('#category').val(null);
    $('#image').val(null);
    $('#image-holder').attr('src', "");

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/categories',
        success: function (categories) {
            let content = `<option>Chose category</option>`;
            for (let category of categories) {
                content += `<option value="${category.id}">${category.name}</option>`
            }
            $('#category').html(content);
        }
    })
}

function createNewProduct() {
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let category = $('#category').val();
    let image = $('#image').prop('files')[0];
    let product = new FormData();
    product.append('name', name);
    product.append('price', price);
    product.append('description', description);
    product.append('image', image);
    product.append('category', category);
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/products`,
        data: product,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function () {
            getAllProduct();
            showSuccessMessage('Create successfully')
        },
        error: function () {
            showErrorMessage('Create failed')
        }
    })
}

function showDeleteProduct(id) {
    let footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" onclick="deleteProduct(${id})"
                        aria-label="Close" class="close" data-dismiss="modal">Delete</button>`;
    $('#footer-delete').html(footer);
}

function deleteProduct(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/products/${id}`,
        success: function () {
            getAllProduct();
            showSuccessMessage('Delete successfully');
        },
        error: function () {
            showErrorMessage('Delete failed')
        }
    })
}

function showEditProduct(id) {
    $('#name').val(null);
    $('#price').val(null);
    $('#description').val(null);
    $('#image').val(null);
    $('#image-holder').attr('src', "");
    $('#category').val(null);
    let title = 'Edit Product';
    let footer = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="editProduct(${id})"
                        aria-label="Close" class="close" data-dismiss="modal">Edit</button>`;
    $('#create-product-title').html(title);
    $('#create-product-footer').html(footer);
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/${id}`,
        success: function (product) {
            $('#name').val(product.name);
            $('#price').val(product.price);
            $('#description').val(product.description);
            $('#category').val(product.category.id);
            $('#image-holder').attr('src', `http://localhost:8080/image/${product.image}`);
            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/categories`,
                success: function (categories) {
                    // let content = `<option>Chose category</option>`;
                    // for (let category of categories) {
                    //     content += `<option value="${category.id}">${category.name}</option>`
                    // }
                    let content = "";
                    for (let i = 0; i < categories.length; i++) {
                        if (product.category.id == categories[i].id) {
                            content += `<option value="${categories[i].id}" selected>${categories[i].name}</option>`
                        } else {
                            content += `<option value="${categories[i].id}">${categories[i].name}</option>`
                        }
                    }
                    $('#category').html(content);
                }
            })
        }
    })
}

function editProduct(id) {
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let category = $('#category').val();
    let image = $('#image').prop('files')[0];
    let product = new FormData();
    product.append('name', name);
    product.append('price', price);
    product.append('description', description);
    product.append('category', category);
    if (image != null) {
        product.append('image', image);
    }

    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/products/${id}`,
        data: product,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (){
            getAllProduct();
            showSuccessMessage('Edit successfully');
        },
        error: function (){
            showErrorMessage('Edit failed');
        }
    })
}

function showSuccessMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'success',
            title: message
        })
    });
}


function showErrorMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'error',
            title: message
        })
    });
}

$(document).ready(function () {
    getAllProduct();
})

