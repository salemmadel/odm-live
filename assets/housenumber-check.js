// Check if jQuery and Shopify are available
if (typeof $ !== 'undefined' && typeof Shopify !== 'undefined') {
  $(document).on("page:load page:change", function () {
    if (Shopify.Checkout.step == 'contact_information') {

    $('body').prepend(`
                    <div class="address-tabs" style="display:none">
                      <span class="address-tabs__btn" data-address="delivery"><img src="https://cdn.shopify.com/s/files/1/0006/6879/4927/files/dr-massing-home-01.svg?v=1652269479" width="40px">Adresse</span>
                      <span class="address-tabs__btn" data-address="packing-station"><img src="https://cdn.shopify.com/s/files/1/0006/6879/4927/files/dr-massing-paket-shop-01.svg?v=1652269479" width="40px">Packstation</span>
                      <span class="address-tabs__btn" data-address="postfiliale"><img src="https://cdn.shopify.com/s/files/1/0006/6879/4927/files/dr-massing-post-store-01.svg?v=1652269479" width="40px">Postfiliale</span>
                    </div>
                  `);

    $('.section__content').attr('data-address', 'delivery');
    $('.section--shipping-address .section__content').prepend($('.address-tabs'));
    $('.address-tabs').show();
    var address_type = $('.section--shipping-address .section__content').data('address');
    $('.address-tabs__btn[data-address=' + address_type + ']').addClass('active');
    $('div[data-address-field="country"]').insertAfter('div[data-address-field="company"]');
    $('div[data-address-field="address1"]').after(`
                    <div data-address-field="house-number" data-autocomplete-field-container="false" class="field field--required">
                    <div class="field__input-wrapper"><label class="field__label field__label--visible" for="checkout_shipping_address_house-number">Hausnummer</label>
                        <input value placeholder="Hausnummer" autocorrect="off" role="combobox"
                        aria-autocomplete="list" aria-expanded="false" aria-required="true"
                        class="field__input" size="30" type="text" id="checkout_shipping_address_house-number" aria-haspopup="false">
                    </div>
                    </div>
                  `);
    $('#checkout_shipping_address_address1').after(`
                    <input placeholder="Straße" autocomplete="shipping address-line1" autocorrect="off"
                    role="combobox" aria-autocomplete="list" aria-expanded="false" aria-required="true"
                    data-backup="address1" data-trekkie-id="shipping_address1_google_autocomplete_field"
                    data-autocomplete-trigger="true" data-autocomplete-title="Vorschläge"
                    data-autocomplete-single-item="1 Option verfügbar"
                    data-autocomplete-multi-item=" Optionen verfügbar"
                    data-autocomplete-item-selection=" von "
                    data-autocomplete-close="Vorschläge schließen" class="field__input" size="30" type="text"
                    value=""
                    id="checkout_shipping_address_address1_street" aria-haspopup="false">
                  `);

    var address_val = $('#checkout_shipping_address_address1').val();
    address_val = address_val.split(/(\d+)/);

    $('#checkout_shipping_address_address1_street').val(address_val[0]);
    var c = 0;
    for (let i in address_val) {
      if (c != 0) {
        $('#checkout_shipping_address_house-number').val($('#checkout_shipping_address_house-number').val() + address_val[i]);
      }
      c++;
    }
  }

  $('input[type="text"]').change(function () {
    this.value = $.trim(this.value);
  });

  $('.address-tabs__btn').click(function (e) {
    var address_type = $(this).attr('data-address');
    var company_field = $('div[data-address-field="company"]');
    var address1_field = $('#checkout_shipping_address_address1');
    var address1_label = $('label[for="checkout_shipping_address_address1"]');
    var house_nr_field = $('div[data-address-field="house-number"]');
    var address1_container = $('div[data-address-field="address1"]');
    var address2_field = $('#checkout_shipping_address_address2');
    var address2_label = $('label[for="checkout_shipping_address_address2"]');


    $('.address-tabs__btn').removeClass('active');
    $(this).addClass('active');
    $('.section--shipping-address .section__content').attr('data-address', address_type);
    if ($(this).attr('data-address') == 'packing-station') {
      company_field.hide();
      address1_field.val('');
      address1_field.attr('placeholder', "Packstationsnummer");
      address1_label.text("Packstationsnummer");
      address2_field.val('');
      address2_field.attr('placeholder', "Kundennummer (Postnummer)");
      address2_label.text("Kundennummer (Postnummer)");
      house_nr_field.hide();
      address1_container.addClass('w-100');

    } else if ($(this).attr('data-address') == 'delivery') {
      company_field.show();
      address1_field.val('');
      address1_field.attr('placeholder', "Straße");
      address1_label.text("Straße");
      address2_field.val('');
      address2_field.attr('placeholder', "Adresszusatz");
      address2_label.text("Adresszusatz");
      house_nr_field.show();
      address1_container.removeClass('w-100');
    } else {
      company_field.hide();
      address1_field.val('');
      address1_field.attr('placeholder', "Postfilialnummer");
      address1_label.text("Postfilialnummer");
      address2_field.val('');
      address2_field.attr('placeholder', "Kundennummer (Postnummer)");
      address2_label.text("Kundennummer (Postnummer)");
      house_nr_field.hide();
      address1_container.addClass('w-100');
    }

  });

  $('#checkout_shipping_address_country').change(function (e) {
    e.stopPropagation();
    var house_number_field = $('#checkout_shipping_address_house-number');
    var house_number_label = $('label[for="checkout_shipping_address_house-number"]');

    $('div[data-address-field="country"]').insertAfter('div[data-address-field="last_name"]');
    if ($(this).val() == 'Austria') {
      house_number_field.attr('placeholder', `Hausnr./Stiege/Tür`);
      house_number_label.text(`Hausnr./Stiege/Tür`);
    } else {
      house_number_field.attr('placeholder', `Hausnummer`);
      house_number_label.text("Hausnummer");
    }
  });

  $('#continue_button').click(function (e) {
    var houseNr = $('#checkout_shipping_address_house-number').val();
    var addressField = $('#checkout_shipping_address_address1');
    var addressField2 = $('#checkout_shipping_address_address2');
    var addressVal = $('#checkout_shipping_address_address1').val();
    var address2Val = $('#checkout_shipping_address_address2').val();
    var addressCountryVal = $('#checkout_shipping_address_country').val();
    var addressZipVal = $('#checkout_shipping_address_zip').val();
    var addressCityVal = $('#checkout_shipping_address_city').val();
    var selected_address_type = $('.section--shipping-address .section__content').attr('data-address');
    var address1_container = $('div[data-address-field="address1"]');
    var address2_container = $('div[data-address-field="address2"]');
    var addressZip_container = $('div[data-address-field="zip"]');
    var addressCity_container = $('div[data-address-field="city"]');

    document.querySelectorAll('.field__message--error').forEach(el => el.remove());

    switch (selected_address_type) {
      case 'delivery':
        var addressVal = $('#checkout_shipping_address_address1_street').val();
        if ($.isNumeric(addressVal[0]) || !$.isNumeric(houseNr[0])) {
          e.preventDefault();
          e.stopPropagation();
          address1_container.find('.field__input-wrapper').after(`<p class="field__message field__message--error" id="error-for-address1">Bitte Straße und Hausnummer überprüfen</p>`);
          address1_container.addClass('field--error');
        } else if (($.isNumeric(houseNr) && houseNr.length >= 6 && houseNr.length <= 10) || addressVal.includes('Packstation') || addressVal.includes('Postnummer') || addressVal.includes('Postnr')) {
          e.preventDefault();
          e.stopPropagation();
          address1_container.find('.field__input-wrapper').after(`<p class="field__message field__message--error" id="error-for-address1">Wollten Sie das Packet an eine Packstation schicken? Wählen Sie oben Packstation aus.</p>`);
          address1_container.addClass('field--error');
        } else if (addressVal.includes('Postfiliale')) {
          e.preventDefault();
          e.stopPropagation();
          address1_container.find('.field__input-wrapper').after(`<p class="field__message field__message--error" id="error-for-address1">Wollten Sie das Packet an eine Postfiliale schicken? Wählen Sie oben Postfiliale aus.</p>`);
          address1_container.addClass('field--error');
        } else {
          addressField.val(addressVal + ' ' + houseNr);
        }
        if ($.isNumeric(address2Val)) {
          e.preventDefault();
          e.stopPropagation();
          address2_container.find('.field__input-wrapper').after(`<p class="field__message field__message--error" id="error-for-address1">Überprüfen Sie Ihre Eingabe. Wollen Sie das Paket an eine Packstation oder Postfiliale schicken, wählen Sie den entsprechenden Reiter aus.</p>`);
          address2_container.addClass('field--error');
        }
        if (addressCountryVal == 'Germany') {
          if (!$.isNumeric(addressZipVal) || addressZipVal.length != 5) {
            e.preventDefault();
            e.stopPropagation();
            addressZip_container.find('.field__input-wrapper').after(`<p class="field__message field__message--error" id="error-for-address-zip">Keine gültige Postleitzahl</p>`);
            addressZip_container.addClass('field--error');
          }
          if ($.isNumeric(addressCityVal)) {
            e.preventDefault();
            e.stopPropagation();
            addressCity_container.find('.field__input-wrapper').after(`<p class="field__message field__message--error" id="error-for-address-zip">Keine gültige Stadt</p>`);
            addressCity_container.addClass('field--error');
          }
        }
        break;
      case 'packing-station':
        if ($.isNumeric(addressVal) && $.isNumeric(address2Val) && address2Val.length >= 6 && address2Val.length <= 10) {
          addressField.val(`Packstation ` + addressVal);
          $('.address-tabs').hide();
        } else {
          if (!$.isNumeric(addressVal) && addressVal.indexOf('Packstation') != 0) {
            e.preventDefault();
            e.stopPropagation();
            address1_container.find('.field__input-wrapper').after(`<p class="field__message field__message--error" id="error-for-address1">In dieses Feld Packstationsnummer eingeben (&quot;Packstation 123&quot; oder &quot;123&quot;)</p>`);
            address1_container.addClass('field--error');
          }
          if (!$.isNumeric(address2Val) || address2Val.length < 6 || address2Val.length > 10) {
            e.preventDefault();
            e.stopPropagation();
            address2_container.find('.field__input-wrapper').after(`<p class="field__message field__message--error" id="error-for-address2">In dieses Feld Kundennummer/Postnummer eingeben (nur Zahlen, 6- bis 10-stellig)</p>`);
            address2_container.addClass('field--error');
          }
        }
        break;
      case 'postfiliale':
        if ($.isNumeric(addressVal) && $.isNumeric(address2Val)) {
          addressField.val(`Postfiliale ` + addressVal);
          $('.address-tabs').hide();

        } else {
          if (!$.isNumeric(addressVal)) {
            e.preventDefault();
            e.stopPropagation();
            address1_container.find('.field__input-wrapper').after(`<p class="field__message field__message--error" id="error-for-address1">In dieses Feld Postfilialnummer eingeben (nur Zahlen)</p>`);
            address1_container.addClass('field--error');
          }
          if (!$.isNumeric(address2Val)) {
            e.preventDefault();
            e.stopPropagation();
            address2_container.find('.field__input-wrapper').after(`<p class="field__message field__message--error" id="error-for-address2">In dieses Feld Kundennummer eingeben (nur Zahlen)</p>`);
            address2_container.addClass('field--error');
          }
        }
        break;
    }
  })
});

$(document).ready(function () {
  $('#checkout_shipping_address_id').on('change', function () {
    const myTimeout = setTimeout(function () {
      $('div[data-address-field="address1"]').after($('div[data-address-field="house-number"]'));
      var addrData = $('#checkout_shipping_address_id option:selected').data('properties');
      if (addrData) {
        var split = addrData['address1'].split(" ");
        $('div[data-address-field="address1"] input').val(split[0]);
        $('div[data-address-field="house-number"] input').val(split[1]);
      }
    }, 500);
  })
})


window.onload = function () {

  var button = document.getElementById('continue_button');
  var input = document.getElementById('checkout_shipping_address_house-number');
  var street = document.getElementById('checkout_shipping_address_address1');

  button.addEventListener('click', function (e) {

    function validateStr(str) {
      var regex = new RegExp("[0-9]+");
      if (regex.test(str) == true) {
        return true
      } else {
        return false;
      }
    }

    function validateStreet(str) {
      var regex = new RegExp("[A-Z]+"); // Check for uppercase first
      if (regex.test(str) == true) {
        regex = new RegExp("[0-9]+"); // Now we check for numbers
        if (regex.test(str) == true) {
          regex = new RegExp("[a-z]+"); // checking now for lowercase
          if (regex.test(str) == true) {
            return true;
          } else return false;
        } else return false;
      } else return true;
    }

    var hasNumber = validateStr(input.value);
    var hasNumberAndStreet = validateStreet(street.value);

    var inputDiv = document.querySelector('.field[data-address-field="house-number"]');
    var divWrapper = document.querySelector('.field[data-address-field="house-number"] .field__input-wrapper');

    if (hasNumber == false && hasNumberAndStreet == false) {
      e.preventDefault();
      e.stopPropagation();
      inputDiv.classList.add('field--error');
      divWrapper.insertAdjacentHTML('afterend', `<p class="field__message field__message--error" id="error-for-address1">Bitte gib deine Hausnummer ein.</p>`);
    }

  });
}
}
