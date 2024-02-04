Ext.define('PHNet.controller.shopping.Requests', {
    extend: 'Ext.app.Controller',
    models: ['shopping.Requestproduct', 'shopping.Requestcomments'],
    stores: ['shopping.Requestproducts', 'shopping.Requestcomments'],
    views: [
        'shopping.RequestsWindow',
        'shopping.ShopprequestsTab',
        'shopping.RequestsGrid',
        'shopping.RequestCommentsWindow',
        'shopping.RequestCommentsGrid',
        'shopping.RequestContextMenu',
        'shopping.ShoppRequestForm',
        'shopping.RequestProductsGrid',
        'gallery.GalleryWindow'
    ],
    refs: [{
            ref: 'requestswindow',
            selector: 'requestswindow'
        },
        {
            ref: 'shopprequeststab',
            selector: 'shopprequeststab'
        },
        {
            ref: 'requestsgrid',
            selector: 'requestsgrid'
        },
        {
            ref: 'requestcontextmenu',
            selector: 'requestcontextmenu'
        },
        {
            ref: 'shoppingrequestform',
            selector: 'shoppingrequestform'
        },
        {
            ref: 'requestproductsgrid',
            selector: 'requestproductsgrid'
        },
        {
            ref: 'requestcommentsgrid',
            selector: 'requestcommentsgrid'
        }
    ],
    init: function() {

        this.control({
            'requestswindow': {
                clearDetails: this.reloadRequestGrid
            },
            'shopprequeststab': {
                search: this.filterSearch
            },
            'shopprequeststab button[action=reload]': {
                click: this.reloadRequestGrid
            },
            'shopprequeststab radiofield[name=filter_menu_circuit_radio]': {
                change: this.filterCircuit
            },
            'shopprequeststab menu[lid=requestFilterMenu] menuitem[lid=requestFilter]': {
                click: this.createFilter
            },
            'shopprequeststab menu[lid=requestFilterMenu] menuitem[lid=requestNoFilter]': {
                click: this.deleteFilter
            },
            'requestfilterform button[action=setfilterclose]': {
                click: this.setFilter
            },
            '#shoppworkscombo': {
                change: this.loadComboRequest
            },
            '#shoppdptoscombo': {
                change: this.loadComboRequest
            },
            '#shopp711monthcombo': {
                change: this.loadComboRequest
            },
            '#shopp711yearcombo': {
                change: this.loadComboRequest
            },
            'shopprequeststab button[action=add]': {
                click: this.addRequestForm
            },
            'shoppingrequestform button[action=storeclose]': {
                click: this.updRequest
            },
            'requestcommentsgrid': {
                deleteclick: this.deleteComment
            },
            'shopprequeststab button[action=upd]': {
                click: this.loadFormRequest
            },
            'shopprequeststab button[action=del]': {
                click: this.delRequest
            },
            'shopprequeststab button[action=request_confirm]': {
                click: this.confirmRequest
            },
            'shopprequeststab button[action=request_approve]': {
                click: this.approveRequest
            },
            'shopprequeststab button[action=request_reject]': {
                click: this.rejectWinRequest
            },
            'requestrejectwindow button[action=reject]': {
                click: this.rejectRequest
            },
            'requestcommentwindow button[action=comment]': {
                click: this.commentRequest
            },
            'requestsgrid': {
                deleteclick: this.delRequest,
                requestselect: this.loadDetails,
                unselect: this.clearDetails,
                itemcontextmenu: this.showContextMenu
            },
            '#addsub711': {
                click: this.handleAddSub711
            },
            '#showpdfrequest': {
                itemclick: this.handleShowPdfRequest
            },
            '#rcomment': {
                itemclick: this.handleCommentRequest
            },
            '#rshowcomment': {
                itemclick: this.handleShowCommentsRequest
            },
            'requestproductsgrid': {
                recordedit: this.updProduct,
                deleteclick: this.delProduct,
                photoclick: this.photoProduct
            },
            'shopprequeststab menu[lid=shoppRequestExportMenu] menuitem[lid=shoppExpModel711]': {
                click: this.requestExpModel
            },
            'shopprequeststab menu[lid=shoppRequestExportMenu] menuitem[lid=shoppExpModelProducts]': {
                click: this.requestExpModel
            },
            'shopprequeststab menu[lid=shoppRequestExportMenu] menuitem[lid=shoppExpModelChronogram]': {
                click: this.requestExpModel
            }
        });
    },

    clearChronogramPanel: function() {
        // define a template to use for the chronogram view
        let chronomTplMarkup = [
            '<p class="help-description"><i class="fas fa-info-circle"></i><br>Cuando seleccione una Solicitud de Compra, el <strong>Cronograma de Suministros</strong> se mostrar\xE1 aqu\xED.</p>'
        ];
        let chronomTpl = Ext.create('Ext.Template', chronomTplMarkup);
        let chronogramPanel = Ext.getCmp('chronogram-panel');
        if (chronogramPanel) {
            chronogramPanel.update(chronomTpl);
        }
    },

    clearProductsPanel: function() {
        let shoppMaincontent = Ext.getCmp('shopp-main-content');

        if (Ext.getCmp('requestproductsgrid')) {
            let requestproductsgrid = Ext.getCmp('requestproductsgrid');
            shoppMaincontent.remove(requestproductsgrid);
        }
        if (Ext.getCmp('shopp-products-help')) {
            let productsHelpPanel = Ext.getCmp('shopp-products-help');
            shoppMaincontent.remove(productsHelpPanel);
        }

        shoppMaincontent.add(Ext.create('PHNet.view.shopping.ShoppProductsHelp'));
    },

    clearDetails: function() {
        Ext.getCmp('shopp-btn-del').setVisible(false);
        Ext.getCmp('shopp-btn-upd').setVisible(false);
        Ext.getCmp('shopp-btn-exp').setDisabled(true);
        Ext.getCmp('shopp-btn-confirm').setVisible(false);
        Ext.getCmp('shopp-btn-approve').setVisible(false);
        Ext.getCmp('shopp-btn-reject').setVisible(false);
        Ext.getCmp('shopp-info-confirm').setVisible(false);
        Ext.getCmp('shopp-info-approve').setVisible(false);
        Ext.getCmp('shopp-info-reject').setVisible(false);
        this.clearChronogramPanel();
        this.clearProductsPanel();
    },

    createFilter: function(item) {

        let createForm = Ext.create('PHNet.view.shopping.RequestFilterForm'),
            form = createForm.down('form');

        createForm.show();

        if (localStorage.getItem('phcp_rfilter') && localStorage.getItem('phcp_rfilter') == 'yes' && Ext.getCmp('search_request_field').getValue() == '') {
            form.getForm().load({
                url: '/phnet.compras/public/api/shopping/filter/loadForm',
                method: 'POST',
                failure: function(form, action) {
                    editor.close();
                    Ext.Msg.alert('Carga Fallida', 'La carga de los parametros filtrados no se ha realizado. Por favor, intentelo de nuevo, de mantenerse el problema contacte con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.');
                }
            });
        }
    },

    filterSearch: function(search) {
        let cthis = this,
            grid = cthis.getRequestsgrid(),
            proxy = grid.getStore().getProxy(),
            work = Ext.getCmp('shoppworkscombo').getValue(),
            dpto = Ext.getCmp('shoppdptoscombo').getValue(),
            user = 0;

        if (localStorage.getItem('phcp_ui') && localStorage.getItem('phcp_ui') > 0) {
            user = localStorage.getItem('phcp_ui');
        }

        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/shopping/requests/' + user + '/' + work + '/' + dpto + '/0/' + search
        });

        grid.getStore().load({
            callback: function(records, operation, success) {
                grid.getSelectionModel().deselect(records, true);
                //$('.x-grid-row').removeClass('x-grid-row-selected');
                //$('.x-grid-row').removeClass('x-grid-row-focused');
                //$('.x-grid-row').removeClass('x-grid-row-over');
                localStorage.setItem('phcp_rfilter', 'yes');
                Ext.getCmp('box-shopping-filter').setVisible(true);
                Ext.getCmp('rq-menu-filter-remove').setVisible(true);
                Ext.getCmp('filter-circuit-all').setValue(true);
                cthis.clearDetails();
            }
        });
    },

    filterCircuit: function(radiofield, newValue, oldValue, eOpts) {

        if (radiofield.getValue()) {

            let cthis = this,
                grid = cthis.getRequestsgrid(),
                proxy = grid.getStore().getProxy(),
                idfield = radiofield.getId(),
                circuit = '',
                search = '-1',
                work = Ext.getCmp('shoppworkscombo').getValue(),
                dpto = Ext.getCmp('shoppdptoscombo').getValue(),
                searchfield = Ext.getCmp('search_request_field').getValue(),
                user = 0;

            switch (idfield) {
                case 'filter-circuit-pending':
                    circuit = 'pending'
                    break;
                case 'filter-circuit-approved':
                    circuit = 'approved'
                    break;
                case 'filter-circuit-rejected':
                    circuit = 'rejected'
                    break;
                default:
                    circuit = 'all'
                    break;
            }

            if (searchfield != null && searchfield != '') {
                search = searchfield
            }

            if (localStorage.getItem('phcp_ui') && localStorage.getItem('phcp_ui') > 0) {
                user = localStorage.getItem('phcp_ui');
            }

            Ext.apply(proxy.api, {
                read: '/phnet.compras/public/api/shopping/requests/' + user + '/' + work + '/' + dpto + '/0/' + search + '/' + circuit
            });

            grid.getStore().load({
                callback: function(records, operation, success) {
                    grid.getSelectionModel().deselect(records, true);
                    if (circuit != 'all') {
                        localStorage.setItem('phcp_rfilter', 'yes');
                        Ext.getCmp('box-shopping-filter').setVisible(true);
                        Ext.getCmp('rq-menu-filter-remove').setVisible(true);
                    }
                    cthis.clearDetails();
                }
            });

        } else {
            return false;
        }
    },

    setFilter: function(button) {

        let win = button.up('window'),
            form = win.down('form'),
            grid = this.getRequestsgrid(),
            values = form.getValues(),
            user = 0,
            work, dpto;

        if (form.isValid()) {

            if (values.description != '' || values.code != '' || values.created_start != '' || values.created_end != '' || values.ubi_start != '' || values.ubi_end || values.state != -1 || values.quote != 'all') {

                button.setText('Filtrando...');
                button.setDisabled(true);
                Ext.getCmp('rq-filterform-cancelbtn').setDisabled(true);

                work = Ext.getCmp('shoppworkscombo').getValue();
                dpto = Ext.getCmp('shoppdptoscombo').getValue();

                if (localStorage.getItem('ui')) {
                    user = localStorage.getItem('ui');
                }

                form.getForm().submit({
                    method: 'POST',
                    url: '/phnet.compras/public/api/shopping/filter',
                    params: {
                        work: work,
                        dpto: dpto,
                        user: user
                    },
                    success: function(form, action) {
                        let data = Ext.decode(action.response.responseText),
                            user = 0;

                        if (localStorage.getItem('phcp_ui') && localStorage.getItem('phcp_ui') > 0) {
                            user = localStorage.getItem('phcp_ui');
                        }

                        //Ext.getCmp('request-filterbtn').down('menu').down().setIconCls('fas fa-check');
                        Ext.getCmp('rq-menu-filter-remove').setVisible(true);
                        button.setText('<i class="fas fa-check"></i>&nbsp;Aceptar');
                        button.setDisabled(false);
                        Ext.getCmp('rq-filterform-cancelbtn').setDisabled(false);
                        win.close();
                        // Load Store
                        let proxy = grid.getStore().getProxy();
                        Ext.apply(proxy.api, {
                            read: '/phnet.compras/public/api/shopping/requests/' + user + '/' + work + '/' + dpto + '/1'
                        });
                        grid.getStore().load();
                        localStorage.setItem('phcp_rfilter', 'yes');
                        Ext.getCmp('search_request_field').setValue('');
                        Ext.getCmp('filter-circuit-all').setValue(true);
                        Ext.getCmp('box-shopping-filter').setVisible(true);
                    },
                    failure: function(form, action) {
                        let data = Ext.decode(action.response.responseText);
                        Ext.MessageBox.show({
                            title: 'Mensaje del Sistema',
                            msg: data.message,
                            icon: 'fas fa-exclamation-triangle fa-2x dlg-error',
                            buttons: Ext.Msg.OK
                        });
                        button.setText('<i class="fas fa-check"></i>&nbsp;Aceptar');
                        button.setDisabled(false);
                        Ext.getCmp('rq-filterform-cancelbtn').setDisabled(false);
                    }
                });
            } else {
                Ext.example.msgError('Ops, ha olvidado algo...', 'No ha definido ning\xFAn criterio de b\xFAsqueda para filtrar.');
            }
        }
    },

    deleteFilter: function(item) {

        let cthis = this,
            grid = this.getRequestsgrid(),
            work = Ext.getCmp('shoppworkscombo').getValue(),
            dpto = Ext.getCmp('shoppdptoscombo').getValue(),
            user = 0;

        if (localStorage.getItem('phcp_ui') && localStorage.getItem('phcp_ui') > 0) {
            user = localStorage.getItem('phcp_ui');
        }

        // Load Store
        let proxy = grid.getStore().getProxy();
        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/shopping/requests/' + user + '/' + work + '/' + dpto
        });
        grid.getStore().load({
            callback: function(records, operation, success) {
                grid.getSelectionModel().deselect(records, true);
                Ext.getCmp('rq-menu-filter-remove').setVisible(false);
                localStorage.removeItem('phcp_rfilter');
                Ext.getCmp('box-shopping-filter').setVisible(false);
                Ext.getCmp('search_request_field').setValue('');
                Ext.getCmp('filter-circuit-all').setValue(true);
                cthis.clearDetails();
            }
        });
    },

    deleteComment: function(id) {

        let commentsGrid = this.getRequestcommentsgrid();

        Ext.Ajax.request({
            url: '/phnet.compras/public/api/shopping/request/comment/del',
            method: 'DELETE',
            params: {
                id: id
            },
            success: function(result) {
                let jsonData = Ext.JSON.decode(result.responseText);
                if (jsonData.error) {
                    Ext.MessageBox.show({
                        title: 'Error en el Sistema',
                        msg: jsonData.error.errorInfo[2],
                        buttons: Ext.MessageBox.OK,
                        icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                    });
                } else {
                    commentsGrid.getStore().load({
                        callback: function(records, operation, success) {
                            commentsGrid.getSelectionModel().deselect(records, true);
                        }
                    });
                }
            },
            failure: function() {
                Ext.MessageBox.show({
                    title: 'Mensaje del Sistema',
                    msg: 'Ha ocurrido un error en el Sistema. Por favor, vuelva a intentar realizar la operacion, de continuar el problema consulte al <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                    buttons: Ext.MessageBox.OK,
                    icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                });
            }
        });
    },

    photoProduct: function(record, animtarget) {

        var photo = record.data.photo,
            win = Ext.create('PHNet.view.gallery.GalleryWindow', {
                animateTarget: animtarget
            });

        // Photo panel
        if (photo == null || photo == '') {
            let nophoto = Ext.create('PHNet.view.gallery.NophotoPanel');
            win.down('#gallery-right').add(nophoto);
            win.show();
            Ext.get('nophoto-product').setHTML(record.data.description);

            localStorage.setItem('phcp_gitem', '');
            localStorage.setItem('phcp_pphoto', '');
        } else {
            let photopanel = Ext.create('PHNet.view.gallery.PhotoPanel');
            win.down('#gallery-right').add(photopanel);
            win.show();
            Ext.get('product-photo-img').setHTML(
                '<img src="/phnet.compras/storage/app/public/products/medium/' + record.data.photo + '">'
            );
            Ext.get('product-photo-link').setHTML(
                '<a href="/phnet.compras/storage/app/public/products/' + record.data.photo + '" target="_blank">Ver Foto a tama&ntilde;o completo</a>'
            );
            Ext.get('product-name').setHTML(record.data.description);

            localStorage.setItem('phcp_gitem', '');
            localStorage.setItem('phcp_pphoto', '');
        }
    },

    reloadRequestGrid: function() {

        let cthis = this,
            grid = cthis.getRequestsgrid(),
            proxy = grid.getStore().getProxy(),
            work = Ext.getCmp('shoppworkscombo').getValue(),
            dpto = Ext.getCmp('shoppdptoscombo').getValue(),
            filter = 0,
            search = '-1',
            user = 0;

        if (localStorage.getItem('phcp_rfilter') == 'yes') filter = 1;
        if (Ext.getCmp('search_request_field').getValue() != '') {
            filter = 0;
            search = Ext.getCmp('search_request_field').getValue();
        }
        if (localStorage.getItem('phcp_ui') && localStorage.getItem('phcp_ui') > 0) {
            user = localStorage.getItem('phcp_ui');
        }

        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/shopping/requests/' + user + '/' + work + '/' + dpto + '/' + filter + '/' + search
        });

        grid.getStore().load({
            callback: function(records, operation, success) {
                grid.getSelectionModel().deselect(records, true);
                $('.x-grid-row').removeClass('x-grid-row-selected');
                $('.x-grid-row').removeClass('x-grid-row-focused');
                $('.x-grid-row').removeClass('x-grid-row-over');
                cthis.clearDetails();
            }
        });
    },

    loadComboRequest: function(combo, newValue, oldValue, eOptsparams) {

        let ctler = this,
            grid = this.getRequestsgrid(),
            proxy = grid.getStore().getProxy(),
            work = Ext.getCmp('shoppworkscombo').getValue(),
            dpto = Ext.getCmp('shoppdptoscombo').getValue(),
            user = 0;

        switch (combo.getId()) {
            case 'shoppworkscombo':
                work = newValue;
                break;
            case 'shoppdptoscombo':
                dpto = newValue;
                break;
        }

        if (localStorage.getItem('phcp_ui') && localStorage.getItem('phcp_ui') > 0) {
            user = localStorage.getItem('phcp_ui');
        }

        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/shopping/requests/' + user + '/' + work + '/' + dpto
        });

        ctler.clearDetails();

        grid.getStore().load({
            callback: function(records, operation, success) {
                grid.getSelectionModel().deselect(records, true);
            }
        });
    },

    setDateIncWithoutSunday: function(startDate, endDate) {

        let diffDate = (((((endDate - startDate) / 1000) / 60) / 60) / 24);
        for (let i = 0; i < Math.trunc(diffDate); i++) {
            startDate.setDate(startDate.getDate() + 1);
            if (startDate.getDay() == 0) {
                diffDate++;
                // Print Sundays
                //console.log(startDate.getDate() + '/' + startDate.getMonth() + '/' + startDate.getFullYear());
            }
        }

        let lastDate = startDate;
        return lastDate;
    },

    loadChronogram: function(approvedate) {

        let chronomTplMarkup = [];

        if (approvedate == 'pending') {
            chronomTplMarkup = [
                '<p class="help-description"><i class="fas fa-info-circle"></i><br><strong>Solicitud de Compra Pendiente de Aprobaci\xF3n</strong><br>Por tal motivo, a\xFAn no tiene Cronograma de Suministro asociado.</p>'
            ];
        } else if (approvedate == 'rejected') {
            chronomTplMarkup = [
                '<p class="help-description"><i class="fas fa-info-circle"></i><br><strong>Solicitud de Compra Rechazada</strong><br>Por tal motivo, no tiene Cronograma de Suministro asociado.</p>'
            ];
        } else if (approvedate == 'CA') {
            chronomTplMarkup = [
                '<p class="help-description"><i class="fas fa-info-circle"></i><br><strong>Distribuci\xF3n de Productos de una Compra Agrupada</strong><br>a partir de su Factura de Suministro. Por tal motivo, esta Solicitud no tiene Cronograma de Suministro asociado.</p>'
            ];
        } else {

            let months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                arr_approvedate = approvedate.split('-');

            // UBPH Approval
            let ubph_approval = new Date(arr_approvedate[0], arr_approvedate[1] - 1, arr_approvedate[2]),
                ubph_approval_date = ubph_approval.getDate() + ' - ' + months[ubph_approval.getMonth()] + ' - ' + ubph_approval.getFullYear();

            // ECM4 Approval
            let ecm4_approval = ubph_approval,
                startDate = new Date(ubph_approval.getFullYear(), ubph_approval.getMonth(), ubph_approval.getDate());
            ecm4_approval.setDate(ecm4_approval.getDate() + 10);
            let endDate = ecm4_approval;
            ecm4_approval = this.setDateIncWithoutSunday(startDate, endDate);
            let ecm4_approval_date = ecm4_approval.getDate() + ' - ' + months[ecm4_approval.getMonth()] + ' - ' + ecm4_approval.getFullYear();

            // UBI Present
            let ubi_present = ecm4_approval;
            startDate = new Date(ubi_present.getFullYear(), ubi_present.getMonth(), ubi_present.getDate());
            ubi_present.setDate(ubi_present.getDate() + 1);
            endDate = ubi_present;
            ubi_present = this.setDateIncWithoutSunday(startDate, endDate);
            let ubi_present_date = ubi_present.getDate() + ' - ' + months[ubi_present.getMonth()] + ' - ' + ubi_present.getFullYear();

            // UBI Approval
            let ubi_approval = ubi_present;
            startDate = new Date(ubi_present.getFullYear(), ubi_present.getMonth(), ubi_present.getDate());
            ubi_approval.setDate(ubi_approval.getDate() + 3);
            endDate = ubi_approval;
            ubi_approval = this.setDateIncWithoutSunday(startDate, endDate);
            let ubi_approval_date = ubi_approval.getDate() + ' - ' + months[ubi_approval.getMonth()] + ' - ' + ubi_approval.getFullYear();

            // ASEG ALMEST Approval
            let aseg_almest_approval = ubi_approval;
            startDate = new Date(ubi_approval.getFullYear(), ubi_approval.getMonth(), ubi_approval.getDate());
            aseg_almest_approval.setDate(aseg_almest_approval.getDate() + 5);
            endDate = aseg_almest_approval;
            aseg_almest_approval = this.setDateIncWithoutSunday(startDate, endDate);
            let aseg_almest_approval_date = aseg_almest_approval.getDate() + ' - ' + months[aseg_almest_approval.getMonth()] + ' - ' + aseg_almest_approval.getFullYear();

            // TECNOTEX Present
            let tecnotex_present = aseg_almest_approval;
            startDate = new Date(aseg_almest_approval.getFullYear(), aseg_almest_approval.getMonth(), aseg_almest_approval.getDate());
            tecnotex_present.setDate(tecnotex_present.getDate() + 3);
            endDate = tecnotex_present;
            tecnotex_present = this.setDateIncWithoutSunday(startDate, endDate);
            let tecnotex_present_date = tecnotex_present.getDate() + ' - ' + months[tecnotex_present.getMonth()] + ' - ' + tecnotex_present.getFullYear();

            // TECNOTEX Approval
            let tecnotex_approval = tecnotex_present;
            startDate = new Date(tecnotex_present.getFullYear(), tecnotex_present.getMonth(), tecnotex_present.getDate());
            tecnotex_approval.setDate(tecnotex_approval.getDate() + 3);
            endDate = tecnotex_approval;
            tecnotex_approval = this.setDateIncWithoutSunday(startDate, endDate);
            let tecnotex_approval_date = tecnotex_approval.getDate() + ' - ' + months[tecnotex_approval.getMonth()] + ' - ' + tecnotex_approval.getFullYear();

            // TECNOTEX Offer
            let tecnotex_offer = tecnotex_approval;
            startDate = new Date(tecnotex_approval.getFullYear(), tecnotex_approval.getMonth(), tecnotex_approval.getDate());
            tecnotex_offer.setDate(tecnotex_offer.getDate() + 21);
            endDate = tecnotex_offer;
            tecnotex_offer = this.setDateIncWithoutSunday(startDate, endDate);
            let tecnotex_offer_date = tecnotex_offer.getDate() + ' - ' + months[tecnotex_offer.getMonth()] + ' - ' + tecnotex_offer.getFullYear();

            // DT Offer
            let dt_offer = tecnotex_offer;
            startDate = new Date(tecnotex_offer.getFullYear(), tecnotex_offer.getMonth(), tecnotex_offer.getDate());
            dt_offer.setDate(dt_offer.getDate() + 15);
            endDate = dt_offer;
            dt_offer = this.setDateIncWithoutSunday(startDate, endDate);
            let dt_offer_date = dt_offer.getDate() + ' - ' + months[dt_offer.getMonth()] + ' - ' + dt_offer.getFullYear();

            // Negotiation & Committee
            let neg_com = dt_offer;
            startDate = new Date(dt_offer.getFullYear(), dt_offer.getMonth(), dt_offer.getDate());
            neg_com.setDate(neg_com.getDate() + 20);
            endDate = neg_com;
            neg_com = this.setDateIncWithoutSunday(startDate, endDate);
            let neg_com_date = neg_com.getDate() + ' - ' + months[neg_com.getMonth()] + ' - ' + neg_com.getFullYear();

            // Closing
            let closing = neg_com;
            startDate = new Date(neg_com.getFullYear(), neg_com.getMonth(), neg_com.getDate());
            closing.setDate(closing.getDate() + 10);
            endDate = closing;
            closing = this.setDateIncWithoutSunday(startDate, endDate);
            let closing_date = closing.getDate() + ' - ' + months[closing.getMonth()] + ' - ' + closing.getFullYear();

            // Contract
            let contract = closing;
            startDate = new Date(closing.getFullYear(), closing.getMonth(), closing.getDate());
            contract.setDate(contract.getDate() + 7);
            endDate = contract;
            contract = this.setDateIncWithoutSunday(startDate, endDate);
            let contract_date = contract.getDate() + ' - ' + months[contract.getMonth()] + ' - ' + contract.getFullYear();

            // Credit Post
            let credit = contract;
            startDate = new Date(contract.getFullYear(), contract.getMonth(), contract.getDate());
            credit.setDate(credit.getDate() + 20);
            endDate = credit;
            credit = this.setDateIncWithoutSunday(startDate, endDate);
            let credit_date = credit.getDate() + ' - ' + months[credit.getMonth()] + ' - ' + credit.getFullYear();

            // Building
            let build = credit;
            startDate = new Date(credit.getFullYear(), credit.getMonth(), credit.getDate());
            build.setDate(build.getDate() + 60);
            endDate = build;
            build = this.setDateIncWithoutSunday(startDate, endDate);
            let build_date = build.getDate() + ' - ' + months[build.getMonth()] + ' - ' + build.getFullYear();

            // Sea Transport
            let transport = build;
            startDate = new Date(build.getFullYear(), build.getMonth(), build.getDate());
            transport.setDate(transport.getDate() + 21);
            endDate = transport;
            transport = this.setDateIncWithoutSunday(startDate, endDate);
            let transport_date = transport.getDate() + ' - ' + months[transport.getMonth()] + ' - ' + transport.getFullYear();

            // DDP Work
            let ddp_work = transport;
            startDate = new Date(transport.getFullYear(), transport.getMonth(), transport.getDate());
            ddp_work.setDate(ddp_work.getDate() + 10);
            endDate = ddp_work;
            ddp_work = this.setDateIncWithoutSunday(startDate, endDate);
            let ddp_work_date = ddp_work.getDate() + ' - ' + months[ddp_work.getMonth()] + ' - ' + ddp_work.getFullYear();

            // define a template to use for the detail view
            chronomTplMarkup = [
                '<div class="chronogram"><div class="title">Cronograma de Suministro</div>',
                '<div class="supply"><span>Aprobaci\xF3n 711 UBPH</span><br>' + ubph_approval_date + '</div>',
                '<div class="supply"><span>Aprobaci\xF3n 711 ECM4</span><br>' + ecm4_approval_date + '</div>',
                '<div class="supply"><span>Presentaci\xF3n 711 UBI-PH</span><br>' + ubi_present_date + '</div>',
                '<div class="supply"><span>Aprobaci\xF3n 711 UBI-PH</span><br>' + ubi_approval_date + '</div>',
                '<div class="supply"><span>Aprobaci\xF3n 711 ASEG-ALMEST</span><br>' + aseg_almest_approval_date + '</div>',
                '<div class="supply"><span>Presentaci\xF3n 711 TECNOTEX</span><br>' + tecnotex_present_date + '</div>',
                '<div class="supply"><span>Aceptaci\xF3n 711 TECNOTEX</span><br>' + tecnotex_approval_date + '</div>',
                '<div class="supply"><span>Ofertas TECNOTEX</span><br>' + tecnotex_offer_date + '</div>',
                '<div class="supply"><span>Dictamen T\xE9cnico Ofertas</span><br>' + dt_offer_date + '</div>',
                '<div class="supply"><span>Negociaci\xF3n y Comites</span><br>' + neg_com_date + '</div>',
                '<div class="supply"><span>Cierre</span><br>' + closing_date + '</div>',
                '<div class="supply"><span>Contrataci\xF3n</span><br>' + contract_date + '</div>',
                '<div class="supply"><span>Carta de Cr\xE9dito</span><br>' + credit_date + '</div>',
                '<div class="supply"><span>Fabricaci\xF3n</span><br>' + build_date + '</div>',
                '<div class="supply"><span>Transporte Mar\xEDtimo</span><br>' + transport_date + '</div>',
                '<div class="supply"><span>DDP Obra</span><br>' + ddp_work_date + '</div>',
                '</div>'
            ];
        }

        let chronomTpl = Ext.create('Ext.Template', chronomTplMarkup),
            chronogramPanel = Ext.getCmp('chronogram-panel');

        // Load Chronogram
        if (chronogramPanel) {
            chronogramPanel.update(chronomTpl);
        }
    },

    loadDetails: function(approvedate, user_reqadd) {

        let cthis = this,
            shoppMaincontent = Ext.getCmp('shopp-main-content');

        cthis.loadChronogram(approvedate);

        // Load Products List		
        if (Ext.getCmp('requestproductsgrid')) {
            let requestproductsgrid = Ext.getCmp('requestproductsgrid');
            shoppMaincontent.remove(requestproductsgrid);
        }
        if (Ext.getCmp('shopp-products-help')) {
            let productsHelpPanel = Ext.getCmp('shopp-products-help');
            shoppMaincontent.remove(productsHelpPanel);
        }

        let requestProducts = Ext.create('PHNet.view.shopping.RequestProductsGrid', {
                flex: 1,
                userCreate: user_reqadd,
                title: 'Listado de Productos Adjunto <div class="tbar-price">Precio Total CUP: <span id="shopp_request_total_price"></span></div>'
            }),
            proxy = requestProducts.getStore().getProxy(),
            grid = this.getRequestsgrid(),
            record = grid.getSelectionModel().getSelection()[0],
            id_request = record.get('id'),
            idx = record.index;

        shoppMaincontent.add(requestProducts);
        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/shopping/request/' + id_request + '/products'
        });
        requestProducts.getStore().load({
            callback: function(records, operation, success) {
                Ext.fly(grid.getView().focus());
                Ext.fly(grid.getView().getNode(idx)).scrollIntoView();
            }
        });

    },

    showContextMenu: function(view, record, node, rowIndex, e) {

        Ext.destroy(Ext.getCmp('requestcontextmenu'));
        let work = record.get('works_abbr'),
            parent = record.get('parent'),
            document = record.get('document'),
            contextMenu = Ext.create('PHNet.view.shopping.RequestContextMenu');

        if (work != 'CA' || parent > 0) {
            contextMenu.remove('addsub711');
        }
        if (document == null || document == '') {
            contextMenu.remove('showpdfrequest');
        }

        contextMenu.setList(record);
        contextMenu.showAt(e.getX(), e.getY());
        e.preventDefault();
    },

    handleAddSub711: function() {

        let grid = this.getRequestsgrid(),
            record = grid.getSelectionModel().getSelection()[0],
            id_request = record.get('id');

        if (id_request == null) {
            return false;
        } else {

            let requestForm = Ext.create('PHNet.view.shopping.ShoppRequestForm'),
                form = requestForm.down('form');

            requestForm.setTitle('<i class="fas fa-shopping-cart fa-sm"></i>&nbsp;&nbsp;Nueva Solicitud de Compra');
            requestForm.show();
            Ext.getCmp('form_request_date').setMinValue(null);
            form.getForm().load({
                url: '/phnet.compras/public/api/shopping/request/loadForm',
                method: 'POST',
                params: {
                    action: 'addSub711',
                    id_request: id_request
                },
                success: function(form, action) {
                    Ext.getCmp('shopprequestform_name').focus();
                    Ext.getCmp('shopprequestform_name').selectText();
                },
                failure: function(form, action) {
                    editor.close();
                    Ext.Msg.alert('Carga Fallida', 'La carga de los parametros de la Solicitud no se ha realizado. Por favor, intentelo de nuevo, de mantenerse el problema contacte con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.');
                }
            });
        }
    },

    handleShowPdfRequest: function(docname) {

        if (docname == null || docname == '') {
            return false;
        } else {
            window.open("http://localhost/phnet.compras/storage/app/public/documents/" + docname);
        }
    },

    handleCommentRequest: function(reqid, reqcode) {

        let commentForm = Ext.create('PHNet.view.shopping.RequestCommentWindow');

        commentForm.setTitle('Agregar Comentario a la Solicitud ' + reqcode);
        Ext.getCmp('request-comment-id').setValue(reqid);
        Ext.getCmp('request-comment-user').setValue(localStorage.getItem('phcp_ui'));

        commentForm.show();
        Ext.getCmp('request-comment').focus();
    },

    commentRequest: function(button) {

        let cthis = this,
            grid = cthis.getRequestsgrid(),
            win = button.up('window'),
            form = win.down('form'),
            values = form.getValues();

        if (form.isValid()) {

            button.setText('Procesando...');
            button.setDisabled(true);
            Ext.getCmp('rcommentform-cancelbutton').setDisabled(true);

            form.getForm().submit({
                method: 'POST',
                url: '/phnet.compras/public/api/shopping/request/comment',
                success: function(result) {

                    button.setText('<i class="fas fa-check"></i>&nbsp;Aceptar');
                    button.setDisabled(false);
                    Ext.getCmp('rcommentform-cancelbutton').setDisabled(false);
                    win.close();

                    Ext.example.msgScs('El Comentario se ha Creado Satisfactoriamente.');
                },
                failure: function() {
                    Ext.MessageBox.show({
                        title: 'Mensaje del Sistema',
                        msg: 'Ha ocurrido un error en el Sistema. Por favor, vuelva a intentar realizar la operacion, de continuar el problema consulte al <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                        buttons: Ext.MessageBox.OK,
                        icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                    });
                }
            });
        }
    },

    handleShowCommentsRequest: function(reqid, reqcode) {

        let commentWindow = Ext.create('PHNet.view.shopping.RequestCommentsWindow'),
            commentsGrid = Ext.getCmp('requestcommentsgrid');
        commentWindow.setTitle('Comentarios Realizados a la Solicitud ' + reqcode);

        // Load Store
        let proxy = commentsGrid.getStore().getProxy();
        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/shopping/request/comments/' + reqid
        });
        commentsGrid.getStore().load();

        commentWindow.show();
    },

    addRequestForm: function() {

        let requestForm = Ext.create('PHNet.view.shopping.ShoppRequestForm');
        requestForm.setTitle('<i class="fas fa-shopping-cart fa-sm"></i>&nbsp;&nbsp;Nueva Solicitud de Compra');
        Ext.getCmp('requestform_updated_by').setValue(localStorage.getItem('phcp_ui'));
        requestForm.show();
        //Ext.getCmp('shopprequestform_name').focus(false, 300);
    },

    /*loadQuote: function (combo, newValue, oldValue, eOptsparams) {

        if (combo.getRawValue() == 'Garantía UBPH') {
            Ext.getCmp('form_request_quote').setValue('warranty').setDisabled(true);
        }
        else {
            Ext.getCmp('form_request_quote').setValue('project').setDisabled(true);
        }

        return;
    },*/

    loadFormRequest: function() {

        let grid = this.getRequestsgrid(),
            record = grid.getSelectionModel().getSelection()[0],
            id_request = record.get('id');

        if (id_request == null) {
            return false;
        } else {

            let editor = Ext.create('PHNet.view.shopping.ShoppRequestForm'),
                form = editor.down('form');

            editor.setTitle('<i class="fas fa-shopping-cart fa-sm"></i>&nbsp;&nbsp;Modificar Solicitud de Compra');
            Ext.getCmp('requestform_updated_by').setValue(localStorage.getItem('phcp_ui'));
            editor.show();

            //Ext.getCmp('form_request_date').setMinValue(null);
            form.getForm().load({
                url: '/phnet.compras/public/api/shopping/request/loadForm',
                method: 'POST',
                params: {
                    action: 'editRequest',
                    id_request: id_request
                },
                success: function(form, action) {
                    Ext.getCmp('shopprequestform_name').focus();
                    Ext.getCmp('shopprequestform_name').selectText();
                },
                failure: function(form, action) {
                    editor.close();
                    Ext.Msg.alert('Carga Fallida', 'La carga de los parametros de la Solicitud no se ha realizado. Por favor, intentelo de nuevo, de mantenerse el problema contacte con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.');
                }
            });
        }
    },

    updRequest: function(button) {

        let cthis = this,
            grid = this.getRequestsgrid(),
            win = button.up('window'),
            form = win.down('form'),
            values = form.getValues(),
            id_request = values.id_request;

        if (form.isValid()) {

            button.setText('Enviando...');
            button.setDisabled(true);
            Ext.getCmp('shopprequestform-cancelbtn').setDisabled(true);

            // UPDATE
            if (id_request > 0) {
                form.getForm().submit({
                    method: 'POST',
                    url: '/phnet.compras/public/api/shopping/request/upd',
                    success: function(form, action) {
                        let data = Ext.decode(action.response.responseText);
                        Ext.getCmp('shopprequestform-okbutton').setText('<i class="fas fa-check"></i>&nbsp;Aceptar');
                        Ext.getCmp('shopprequestform-okbutton').setDisabled(false);
                        Ext.getCmp('shopprequestform-cancelbtn').setDisabled(false);
                        win.close();
                        Ext.example.msgScs('Solicitud de Compra Actualizada Satisfactoriamente.');
                        grid.getStore().load({
                            callback: function(records, operation, success) {
                                grid.getSelectionModel().deselect(records, true);
                                $('.x-grid-row').removeClass('x-grid-row-selected');
                                $('.x-grid-row').removeClass('x-grid-row-focused');
                                $('.x-grid-row').removeClass('x-grid-row-over');
                                cthis.clearDetails();
                            }
                        });
                    },
                    failure: function(form, action) {
                        let data = Ext.decode(action.response.responseText);
                        Ext.MessageBox.show({
                            title: 'Mensaje del Sistema',
                            msg: data.message,
                            icon: 'fas fa-exclamation-triangle fa-2x dlg-error',
                            buttons: Ext.Msg.OK
                        });
                        Ext.getCmp('shopprequestform-okbutton').setText('<i class="fas fa-check"></i>&nbsp;Aceptar');
                        Ext.getCmp('shopprequestform-okbutton').setDisabled(false);
                        Ext.getCmp('shopprequestform-cancelbtn').setDisabled(false);
                    }
                });
            }
            // CREATE
            else {
                form.getForm().submit({
                    method: 'POST',
                    url: '/phnet.compras/public/api/shopping/request/add',
                    success: function(form, action) {
                        let data = Ext.decode(action.response.responseText);
                        Ext.getCmp('shopprequestform-okbutton').setText('<i class="fas fa-check"></i>&nbsp;Aceptar');
                        Ext.getCmp('shopprequestform-okbutton').setDisabled(false);
                        Ext.getCmp('shopprequestform-cancelbtn').setDisabled(false);
                        win.close();
                        Ext.example.msgScs('Solicitud de Compra Agregada Satisfactoriamente.');
                        grid.getStore().load({
                            callback: function(records, operation, success) {
                                grid.getSelectionModel().deselect(records, true);
                                $('.x-grid-row').removeClass('x-grid-row-selected');
                                $('.x-grid-row').removeClass('x-grid-row-focused');
                                $('.x-grid-row').removeClass('x-grid-row-over');
                                cthis.clearDetails();
                            }
                        });
                    },
                    failure: function(form, action) {
                        let data = Ext.decode(action.response.responseText);
                        Ext.MessageBox.show({
                            title: 'Mensaje del Sistema',
                            msg: data.message,
                            icon: 'fas fa-exclamation-triangle fa-2x dlg-error',
                            buttons: Ext.Msg.OK
                        });
                        Ext.getCmp('shopprequestform-okbutton').setText('<i class="fas fa-check"></i>&nbsp;Aceptar');
                        Ext.getCmp('shopprequestform-okbutton').setDisabled(false);
                        Ext.getCmp('shopprequestform-cancelbtn').setDisabled(false);
                    }
                });
            }
        }
    },

    delRequest: function(button) {

        let cthis = this,
            grid = this.getRequestsgrid(),
            record = grid.getSelectionModel().getSelection()[0],
            id_request = record.get('id'),
            id_user = localStorage.getItem('phcp_ui');

        Ext.Msg.confirm("Eliminar Solicitud de Compra", "La Solicitud de Compra <strong>" + record.get('code') + "</strong>, y su documentaci\xF3n adjunta ser\xE1n Eliminadas definitivamente del sistema. \xBFConfirma que desea realizar esta operaci\xF3n?", function(btnText) {

            if (btnText === "yes") {
                Ext.Ajax.request({
                    url: '/phnet.compras/public/api/shopping/request/del',
                    method: 'POST',
                    params: {
                        id: id_request,
                        id_user: id_user
                    },
                    success: function() {
                        Ext.example.msgScs('Solicitud de Compra Eliminada Satisfactoriamente.');
                        grid.getStore().load({
                            callback: function(records, operation, success) {
                                grid.getSelectionModel().deselect(records, true);
                                $('.x-grid-row').removeClass('x-grid-row-selected');
                                $('.x-grid-row').removeClass('x-grid-row-focused');
                                $('.x-grid-row').removeClass('x-grid-row-over');
                                cthis.clearDetails();
                            }
                        });
                    },
                    failure: function() {
                        Ext.MessageBox.show({
                            title: 'Mensaje del Sistema',
                            msg: 'Ha ocurrido un error en el Sistema. Por favor, vuelva a intentar realizar la operacion, de continuar el problema consulte al <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                            buttons: Ext.MessageBox.OK,
                            icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                        });
                    }
                });
            }
        }, this);
    },

    confirmRequest: function(button) {

        let grid = this.getRequestsgrid(),
            record = grid.getSelectionModel().getSelection()[0],
            id_request = record.get('id'),
            id_user = localStorage.getItem('phcp_ui');

        Ext.Msg.confirm("Confirmar Solicitud de Compra", "Esta Solicitud de Compra ser\xE1 <strong>Confirmada</strong>, lo cual indica que usted ha Revisado, y Acepta, su Modelo 711 y Listado de Productos adjunto. <br>\xBFConfirma que desea realizar esta operaci\xF3n?", function(btnText) {

            if (btnText === "yes") {
                Ext.Ajax.request({
                    url: '/phnet.compras/public/api/shopping/request/confirm',
                    method: 'POST',
                    params: {
                        id_request: id_request,
                        id_user: id_user
                    },
                    success: function(result) {
                        let jsonData = Ext.JSON.decode(result.responseText);
                        if (jsonData.error) {
                            Ext.MessageBox.show({
                                title: 'Error en el Sistema',
                                msg: jsonData.error.errorInfo[2],
                                buttons: Ext.MessageBox.OK,
                                icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                            });
                        } else {
                            Ext.getCmp('shopp-btn-confirm').setVisible(false);
                            Ext.getCmp('shopp-btn-reject').setVisible(false);
                            Ext.getCmp('shopp-info-confirm').setVisible(true);
                        }
                    },
                    failure: function() {
                        Ext.MessageBox.show({
                            title: 'Mensaje del Sistema',
                            msg: 'Ha ocurrido un error en el Sistema. Por favor, vuelva a intentar realizar la operacion, de continuar el problema consulte al <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                            buttons: Ext.MessageBox.OK,
                            icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                        });
                    }
                });
            }
        }, this);
    },

    approveRequest: function(button) {

        let cthis = this,
            grid = this.getRequestsgrid(),
            record = grid.getSelectionModel().getSelection()[0],
            id_request = record.get('id'),
            id_user = localStorage.getItem('phcp_ui');

        Ext.Msg.confirm("Aprobar Solicitud de Compra", "Esta Solicitud de Compra ser\xE1 <strong>Aprobada</strong>, lo cual indica que usted ha Revisado, y Acepta, su Modelo 711 y Listado de Productos adjunto. <br>\xBFConfirma que desea realizar esta operaci\xF3n?", function(btnText) {

            if (btnText === "yes") {
                Ext.Ajax.request({
                    url: '/phnet.compras/public/api/shopping/request/approve',
                    method: 'POST',
                    params: {
                        id_request: id_request,
                        id_user: id_user
                    },
                    success: function(result) {
                        let jsonData = Ext.JSON.decode(result.responseText);
                        if (jsonData.error) {
                            Ext.MessageBox.show({
                                title: 'Error en el Sistema',
                                msg: jsonData.error.errorInfo[2],
                                buttons: Ext.MessageBox.OK,
                                icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                            });
                        } else {
                            Ext.getCmp('shopp-btn-approve').setVisible(false);
                            Ext.getCmp('shopp-btn-reject').setVisible(false);
                            Ext.getCmp('shopp-info-approve').setVisible(true);

                            grid.getSelectionModel().getSelection()[0].set('gendir_aprove', 1);
                            grid.getView().refresh();
                            cthis.loadChronogram(jsonData.approvedate);
                        }
                    },
                    failure: function() {
                        Ext.MessageBox.show({
                            title: 'Mensaje del Sistema',
                            msg: 'Ha ocurrido un error en el Sistema. Por favor, vuelva a intentar realizar la operacion, de continuar el problema consulte al <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                            buttons: Ext.MessageBox.OK,
                            icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                        });
                    }
                });
            }
        }, this);
    },

    rejectWinRequest: function(button) {

        let grid = this.getRequestsgrid(),
            record = grid.getSelectionModel().getSelection()[0],
            id_request = record.get('id'),
            reqcode = record.get('codedb');
        id_user = localStorage.getItem('phcp_ui'),
            rejectWin = Ext.create('PHNet.view.shopping.RequestRejectWindow');

        rejectWin.setTitle('Rechazar Solicitud de Compra ' + reqcode);
        rejectWin.show();
        Ext.getCmp('request-reject-id').setValue(id_request);
        Ext.getCmp('request-reject-user').setValue(id_user);
        Ext.getCmp('request-reject-comment').focus();
    },

    rejectRequest: function(button) {

        let cthis = this,
            grid = cthis.getRequestsgrid(),
            win = button.up('window'),
            form = win.down('form'),
            values = form.getValues();

        if (form.isValid()) {

            button.setText('Procesando...');
            button.setDisabled(true);
            Ext.getCmp('rejectform-cancelbutton').setDisabled(true);

            form.getForm().submit({
                method: 'POST',
                url: '/phnet.compras/public/api/shopping/request/reject',
                success: function(result) {

                    button.setText('<i class="fas fa-check"></i>&nbsp;Aceptar');
                    button.setDisabled(false);
                    Ext.getCmp('rejectform-cancelbutton').setDisabled(false);
                    win.close();
                    Ext.getCmp('shopp-btn-confirm').setVisible(false);
                    Ext.getCmp('shopp-btn-approve').setVisible(false);
                    Ext.getCmp('shopp-btn-reject').setVisible(false);
                    Ext.getCmp('shopp-info-reject').setVisible(true);

                    grid.getSelectionModel().getSelection()[0].set('gendir_reject', 1);
                    grid.getView().refresh();
                    cthis.loadChronogram('rejected');
                },
                failure: function() {
                    Ext.MessageBox.show({
                        title: 'Mensaje del Sistema',
                        msg: 'Ha ocurrido un error en el Sistema. Por favor, vuelva a intentar realizar la operacion, de continuar el problema consulte al <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                        buttons: Ext.MessageBox.OK,
                        icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                    });
                }
            });
        }
    },

    updProduct: function(record) {

        let requestGrid = this.getRequestsgrid(),
            productsGrid = this.getRequestproductsgrid(),
            requestRec = requestGrid.getSelectionModel().getSelection()[0],
            id_request = requestRec.get('id');
        id_product = record.data.id,
            field = record.field,
            rowIdx = record.rowIdx,
            colIdx = record.colIdx,
            oldvalue = record.oldvalue,
            newvalue = record.newvalue,
            user = localStorage.getItem('phshopping_userid');

        if ((record.data.id != null && oldvalue == newvalue) || (newvalue == null || newvalue == '')) {
            return;
        }

        //if (field == 'price') { newvalue = parseFloat(newvalue); }

        if (id_product == '' || id_product == null) {
            // Add Product
            Ext.Ajax.request({
                url: '/phnet.compras/public/api/shopping/request/product/add',
                method: 'POST',
                params: {
                    field: field,
                    value: newvalue,
                    id_request: id_request
                },
                success: function(result, request) {
                    let jsonData = Ext.JSON.decode(result.responseText);
                    if (jsonData.failure) {
                        Ext.MessageBox.show({
                            title: 'Mensaje del Sistema',
                            msg: jsonData.message,
                            buttons: Ext.MessageBox.OK,
                            icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                        });
                    } else {
                        productsGrid.getStore().load({
                            callback: function(records, operation, success) {
                                let nextfield = colIdx + 1;
                                productsGrid.plugins[0].startEditByPosition({
                                    row: rowIdx,
                                    column: nextfield
                                });
                            }
                        });
                    }
                },
                failure: function() {
                    Ext.MessageBox.show({
                        title: 'Mensaje del Sistema',
                        msg: 'Ha ocurrido un error en el Sistema. Por favor, vuelva a intentar realizar la operaci\xF3n, de continuar el problema consulte al <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                        buttons: Ext.MessageBox.OK,
                        icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                    });
                }
            });
        } else {
            // Update Product
            Ext.Ajax.request({
                url: '/phnet.compras/public/api/shopping/request/product/upd',
                method: 'PUT',
                params: {
                    id_product: id_product,
                    field: field,
                    value: newvalue
                },
                success: function(result, request) {
                    let jsonData = Ext.JSON.decode(result.responseText);
                    if (jsonData.failure) {
                        Ext.MessageBox.show({
                            title: 'Mensaje del Sistema',
                            msg: jsonData.message,
                            buttons: Ext.MessageBox.OK,
                            icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                        });
                    } else {
                        if (colIdx < 8) {
                            productsGrid.getStore().load({
                                callback: function(records, operation, success) {
                                    let nextfield = colIdx + 1;
                                    productsGrid.plugins[0].startEditByPosition({
                                        row: rowIdx,
                                        column: nextfield
                                    });
                                }
                            });
                        } else {
                            productsGrid.getStore().load();
                        }
                    }
                },
                failure: function() {
                    Ext.MessageBox.show({
                        title: 'Mensaje del Sistema',
                        msg: 'Ha ocurrido un error en el Sistema. Por favor, vuelva a intentar realizar la operaci\xF3n, de continuar el problema consulte al <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                        buttons: Ext.MessageBox.OK,
                        icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                    });
                }
            });
        }
    },

    delProduct: function(id) {

        let productsGrid = this.getRequestproductsgrid();

        Ext.Msg.confirm("Eliminar Producto", "Este Producto ser\xE1 eliminado del Listado Adjunto. \xBFConfirma que desea realizar esta operaci\xF3n?", function(btnText) {

            if (btnText === "yes") {
                Ext.Ajax.request({
                    url: '/phnet.compras/public/api/shopping/request/product/del',
                    method: 'DELETE',
                    params: {
                        id: id
                    },
                    success: function() {
                        productsGrid.getStore().load({
                            callback: function(records, operation, success) {
                                productsGrid.getSelectionModel().deselect(records, true);
                            }
                        });
                    },
                    failure: function() {
                        Ext.MessageBox.show({
                            title: 'Mensaje del Sistema',
                            msg: 'Ha ocurrido un error en el Sistema. Por favor, vuelva a intentar realizar la operacion, de continuar el problema consulte al <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                            buttons: Ext.MessageBox.OK,
                            icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                        });
                    }
                });
            }
        }, this);
    },

    requestExpModel: function(item) {

        let itemId = item.getItemId(),
            requestGrid = this.getRequestsgrid(),
            requestRec = requestGrid.getSelectionModel().getSelection()[0],
            id_request = requestRec.get('id'),
            modelName = '';

        switch (itemId) {
            case 'shoppExpModel711':
                modelName = '711'
                break;
            case 'shoppExpModelProducts':
                modelName = 'Products'
                break;
            case 'shoppExpModelChronogram':
                modelName = 'Chronogram'
                break;
        }

        if (modelName == 'Chronogram' && ((requestRec.get('gendir_reject') == 1) || (requestRec.get('parent') != null && requestRec.get('parent') != '') || (requestRec.get('gendir_aprove') == 0 && requestRec.get('gendir_reject') == 0))) {

            let msg = '';
            if (requestRec.get('gendir_reject') == 1) {
                msg = 'Esta Solicitud de Compra ha sido <strong>Rechazada</strong>. Por tal motivo, no tiene Cronograma de Sumninistro asociado.';
            }
            if (requestRec.get('parent') != null && requestRec.get('parent') != '') {
                msg = 'Esta Solicitud es una <strong>Distribuci\xF3n de Productos de una Compra Agrupada</strong>.<br>Por tal motivo, no tiene Cronograma de Suministro asociado.';
            }
            if (requestRec.get('gendir_aprove') == 0 && requestRec.get('gendir_reject') == 0) {
                msg = 'Esta Solicitud de Compra est\xE1 <strong>Pendiente de Aprobaci\xF3n</strong>. Por tal motivo no tiene Cronograma de Sumninistro asociado.';
            }

            Ext.MessageBox.show({
                title: 'Mensaje del Sistema',
                msg: msg,
                buttons: Ext.MessageBox.OK,
                icon: 'fas fa-info-circle fa-2x dlg-info'
            });

            return;
        }

        let formpdf = Ext.create('Ext.form.Panel', {
            items: [{
                    xtype: 'hiddenfield',
                    name: 'id_request',
                    value: id_request
                },
                {
                    xtype: 'hiddenfield',
                    name: 'model_name',
                    value: modelName
                }
            ]
        });

        formpdf.getForm().doAction('standardsubmit', {
            url: '/phnet.compras/public/api/shopping/pdf/711',
            standardSubmit: true,
            scope: this,
            method: 'GET',
            waitTitle: '&nbsp;<i class="fas fa-cog fa-spin text-white"></i>&nbsp;Creando PDF...',
            waitMsg: '<i class="fas fa-file-pdf icon-red icon-pdf-msg"></i>Por favor, espere mientras se genera el documento.&nbsp;&nbsp;',
            success: function(form, action) {
                formpdf.destroy(); //or destroy();
            }
        });
        Ext.defer(function() {
            Ext.MessageBox.hide();
        }, 10000);
    }
})