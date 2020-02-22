export const jsGetChemistDetailForCart = `
function getProductDetailForCart() {
    var product = {
        title : "Chemist product name",
        price : 0.0,
        quantity : 1,
        options : [],
        image : "url_of_selected_product_image",
        parentImage : "url_of_parent_image_as_default",
        detailUrl : "product_source_url",
        shop_name : "Chemist Warehouse",
        currency : "AUD"
      };

      var productDetail = document.getElementsByClassName('product_details')[0];
      if(productDetail){
                product.detailUrl = window.location.href;
                product.title = productDetail.querySelectorAll('.product-name h1')[0].innerText;

                product.price = parseFloat(document.getElementsByClassName('Price')[0].innerText.replace('$', ''));

                product.quantity = parseInt(document.getElementsByClassName('product-dropdown')[0].value);
        
                product.image = document.getElementsByClassName('product-thumbnail')[0].getAttribute('src');
                product.parentImage = document.getElementsByClassName('product-thumbnail')[0].getAttribute('src');
                
                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'getProductDetailForCart', value: [product]}))
        }
    }

getProductDetailForCart();
true
`