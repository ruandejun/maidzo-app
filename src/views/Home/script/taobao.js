export const jsHideTaobaoThing = `
    function hideTaobaoThings() {
        var hides = document.querySelectorAll('.title-wrapper');
        hides.forEach(function(h){h.style.display='none';});

        var banners = document.querySelectorAll('.smartbanner-wrapper');
        banners.forEach(function(banner){banner.style.display='none';});

        var carts = document.querySelectorAll('.toolbar__cart');
        carts.forEach(function(cart) {cart.style.display='none';});

        var bars = document.querySelectorAll('.bar');
        bars.forEach(function(bar) {bar.style.display='none';});

        var closes = document.querySelectorAll('.mui-zebra-module .close-btn');
        closes.forEach(function(close) {close.click();});

        closes = document.querySelectorAll('.mui-zebra-module .zebra-oversea-smartbanner-clear');
        closes.forEach(function(close) {close.click();});
    }
    hideTaobaoThings();
    `

export const jsCheckReadyToAddCart = `
    function checkReadyToAddCart() {
      var canAddCart = true;
      var element = document.querySelectorAll('.modal-sku-content');
      element.forEach(function(node) {
        var opt = node.getElementsByClassName('modal-sku-content-item-active').length;
        if (opt == 'undefined' || opt < 1) {
          canAddCart = false;
        } else {}
      });
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'checkReadyToAddCart', value: canAddCart}))
    }
    checkReadyToAddCart();
`


export const jsShowOptionsPopup = `
    function forceShowOptionPopup(){
    var addCart = document.getElementsByClassName('bar-addcart')[0]; 
    if(addCart) { 
        addCart.click();
    } else { 
        addCart = document.getElementsByClassName('bar-buynow')[0];
        if(addCart) { 
        addCart.click();
        }
    }

    
    }
    forceShowOptionPopup();

    function hidePopupAddToCartButtons() {
        var modalBtns = document.querySelectorAll('.sku.card .modal .modal-btn-wrapper');
        modalBtns.forEach(function(btn) {btn.style.display='none';});
    }
    hidePopupAddToCartButtons();
`

export const jsGetProductDetailForCart = `
function getProductDetailForCart() {
    var product = {
        title : "Taobao product name",
        price : 0.0,
        quantity : 1,
        options : [],
        image : "url_of_selected_product_image",
        parentImage : "url_of_parent_image_as_default",
        detailUrl : "product_source_url",
        shop_name : "shop_name",
        currency : "CNY"
      };

      product.detailUrl = window.location.href;
      product.title = document.getElementsByClassName('title')[0].innerText;
      product.price = parseFloat(document.getElementsByClassName('modal-sku-title-price')[0].innerText);
      product.quantity = parseInt(document.getElementsByClassName('sku-number-edit')[0].value);
      product.shop_name = document.getElementsByClassName('shop-title-text')[0].innerText;

      var prdImages = document.querySelectorAll('.modal-title-sku .modal-sku-image img');
      product.image = prdImages[0].src;
      product.parentImage = document.getElementsByClassName('mui-lazy')[0].getAttribute('src');;

      var selectedOptions = [];
      var element = document.querySelectorAll('.modal-sku-content');
      element.forEach(function(node) {
        var option = {
          propertyTitle : node.getElementsByClassName('modal-sku-content-title')[0].innerText,
          propertyValue : node.getElementsByClassName('modal-sku-content-item-active')[0].innerText
        };
        selectedOptions.push(option);
      });

      product.options = selectedOptions;
      
      closeOptionPopup();
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'getProductDetailForCart', value: product}))
}

function closeOptionPopup() {
  var modalCloses = document.querySelectorAll('.modal.modal-show .modal-close-btn');
  modalCloses.forEach(function(close){close.click();});
}
getProductDetailForCart();
`