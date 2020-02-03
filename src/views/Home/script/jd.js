export const jsHideJDThing = `
    function hideJDThings() {
        // var hides = document.querySelectorAll('.title-wrapper');
        // hides.forEach(function(h){h.style.display='none';});

        var banners = document.querySelectorAll('.smartbanner-wrapper');
        banners.forEach(function(banner){banner.style.display='none';});

        var carts = document.querySelectorAll('.de_btn_wrap');
        carts.forEach(function(cart) {cart.style.display='none';});

        var bars = document.querySelectorAll('.commonNav');
        bars.forEach(function(bar) {bar.style.display='none';});

        var closes = document.querySelectorAll('.mui-zebra-module .close-btn');
        closes.forEach(function(close) {close.click();});

        closes = document.querySelectorAll('.mui-zebra-module .zebra-oversea-smartbanner-clear');
        closes.forEach(function(close) {close.click();});
    }
    hideJDThings();
    `

export const jsCheckJDReadyToAddCart = `
    function checkReadyToAddCart() {
      var canAddCart = 1;
      var area = document.getElementById('popupBuyArea');
        var element = area.querySelectorAll('.sku_choose');
        element.forEach(function(node) {
          var opt = node.getElementsByClassName('item active').length;
          if (opt == 'undefined' || opt < 1) {
            canAddCart = 0;
          } else {}
        });

      var containerShow = document.getElementsByClassName('detail_sku_v1_main show').length;
      if(canAddCart == 0){
        if (containerShow == 'undefined' || containerShow < 1) {
          canAddCart = 0;
        } else {
          canAddCart = 2;
        }
      } else {
        if (containerShow == 'undefined' || containerShow < 1) {
          canAddCart = 0;
        }
      }
      
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'checkReadyToAddCart', value: canAddCart}))
    }
    checkReadyToAddCart();
`


export const jsShowJDOptionsPopup = `
    function forceShowOptionPopup(){
      var addCart = document.getElementsByClassName('.btn .btn_buy')[0]; 
      if(addCart) { 
          addCart.click();
      } else { 
          addCart = document.getElementsByClassName('btn btn_buy')[0];
          if(addCart) { 
          addCart.click();
          }
      }
    }
    forceShowOptionPopup();

    function hidePopupAddToCartButtons() {
        var modalBtn = document.getElementById('popupConfirm');
        if(modalBtn){
          modalBtn.style.display='none';
        }
    }
    hidePopupAddToCartButtons();
`

export const jsGetJDProductDetailForCart = `
function getProductDetailForCart() {
    var product = {
        title : "JD product name",
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

      let links = product.detailUrl.split('?');
      if(links.length > 0){
        product.detailUrl = links[0].replace('item.m', 'item').replace('/product', '')
      }
      
      product.title = document.getElementById('itemName').innerText;

      let popupArea = document.getElementById('popupBuyArea');

      product.price = parseFloat(document.getElementsByClassName('price')[0].innerText.replace('¥', ''));

      product.quantity = parseInt(popupArea.getElementsByClassName('count_choose')[0].getElementsByClassName('text')[0].value);
      product.shop_name = document.getElementsByClassName('shop_info_name')[0].getElementsByClassName('name')[0].innerText.trim();

      var prdImages = document.getElementById('firstImg');
      if(prdImages){
        product.image = prdImages.src;
        product.parentImage = prdImages.src;
      } else {
        prdImages = popupArea.getElementsByClassName('avt');
        if(prdImages && prdImages.length > 0){
          product.image = prdImages[0].src;
          product.parentImage = prdImages[0].src;
        }
      }


      var selectedOptions = [];
      var element = popupArea.querySelectorAll('.sku_choose');
      element.forEach(function(node) {
        var option = {
          propertyTitle : node.previousSibling.innerText,
          propertyValue : node.getElementsByClassName('item active')[0].innerText
        };
        selectedOptions.push(option);
      });

      product.options = selectedOptions;
      
      closeOptionPopup();
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'getProductDetailForCart', value: [product]}))
}

function closeOptionPopup() {
  let popupArea = document.getElementById('popupBuyArea');
  var modalCloses = popupArea.querySelectorAll('.close');
  modalCloses.forEach(function(close){close.click();});
}
getProductDetailForCart();
`