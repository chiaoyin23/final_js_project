//console.log(api_path,token)

//產品列表
const productList = document.querySelector('.productWrap');
let productData = [];
let cartData = [];

function renderProductList(renderData){
    let str = "";
    renderData.forEach(function(item){
        str += `<li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${item.images}" alt="">
        <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${item.origin_price}</del>
        <p class="nowPrice">NT$${item.price}</p>
        </li>`
    });
    productList.innerHTML = str;
};

function init(){
    getProductList();
    getCartList();
}

init();
function getProductList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
    .then((res) => {
        //console.log(res.data.products)
        productData = res.data.products;
        renderProductList(productData);
    })
    .catch((e)=>{
        console.log(e)
    })
};

const productSelect = document.querySelector(".productSelect");
productSelect.addEventListener('change',function(e){
    //console.log(e.target.value);
    const category = e.target.value;
    let filterData;
    if(category =="全部"){
        filterData = productData;
    }else{
        filterData = productData.filter(function(item){
            return (category == item.category)
        }); 
    }

    renderProductList(filterData);

});

productList.addEventListener('click',function(e){
    e.preventDefault(); //取消預設行為
    // console.log(e.target.getAttribute("data-id"));
    let addCartClass = e.target.getAttribute("class");
    if(addCartClass !== "addCardBtn"){
        return; //代表不是點到按鈕
    }
    let productId = e.target.getAttribute("data-id");
    console.log(productId);

    let numCheck = 1;
    cartData.forEach(function(item){
        if(item.product.id === productId){
            numCheck = item.quantity+=1;
        }
    })
    // console.log(numCheck);
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
        "data": {
          "productId": productId,
          "quantity": numCheck
        }
      })
    .then((res)=>{
        // console.log(res);
        // alert("加入購物車");
        getCartList();
    })
    .catch((e)=>{
        console.log(e);
    })

})

//購物車列表
const cartList = document.querySelector('.shoppingCart-tableList');
function getCartList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then((res) => {
        //console.log(res.data)
        document.querySelector(".js-total").textContent = res.data.finalTotal;
        cartData = res.data.carts;
        let str = "";
        cartData.forEach(function(item){
            str += ` <tr>
            <td>
                <div class="cardItem-title">
                    <img src="${item.product.images}" alt="">
                    <p>${item.product.title}</p>
                </div>
            </td>
            <td>NT$${item.product.price}</td>
            <td>${item.quantity}</td>
            <td>NT$${item.product.price * item.quantity}</td>
            <td class="discardBtn">
                <a href="#" class="material-icons" data-id="${item.id}">
                    clear
                </a>
            </td>
        </tr>`;
        });

        cartList.innerHTML = str;
    })
    .catch((e)=>{
        console.log(e)
    })

}

//清除單筆購物車
cartList.addEventListener('click',function(e){
    e.preventDefault(); //取消預設行為
    // console.log(e.target);
    const cartId = e.target.getAttribute("data-id");
    if(cartId == null){
        return;
    }
    // console.log(cartId);
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
    .then((res)=>{
        alert("刪除單筆購物車成功");
        getCartList();
    })
    .catch((e)=>{
        console.log(e);
    })

});

//清除全部購物車
const discardAll = document.querySelector('.discardAllBtn')
discardAll.addEventListener('click',function(e){
    e.preventDefault();
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
    .then((res)=>{
        alert("刪除全部購物車成功");
        getCartList();
    })
    .catch((e)=>{
        alert("購物車已清空");
        console.log(e);
    })
})

//送出訂單
const orderInfoBtn = document.querySelector(".orderInfo-btn")
orderInfoBtn.addEventListener("click",function(e){
    e.preventDefault();
    if(cartData.length == 0){
        alert("請加入購物車");
        return;
    }
    const orderInfoForm = document.querySelector(".orderInfo-form")
    const customerName = document.querySelector("#customerName").value;
    const customerPhone = document.querySelector("#customerPhone").value;
    const customerEmail = document.querySelector("#customerEmail").value;
    const customerAddress = document.querySelector("#customerAddress").value;
    const customerTradeWay = document.querySelector("#tradeWay").value;
    
    if(customerAddress==""||customerName==""||customerEmail==""||customerPhone==""||customerTradeWay==""){
        alert("請輸入完整訂單資訊");
        return;
    }
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,{
        "data": {
          "user": {
            "name": customerName,
            "tel": customerPhone,
            "email": customerEmail,
            "address": customerAddress,
            "payment": customerTradeWay
          }
        }
      }).then((res)=>{
        alert("訂單建立成功");
        getCartList();
        orderInfoForm.reset();
      })
})