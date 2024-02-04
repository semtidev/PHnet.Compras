Ext.define('PHNet.controller.Gallery', {
    extend: 'Ext.app.Controller',
    models: [],
    stores: [],
    views: [
        'gallery.ImageView'
    ],
    refs: [
        {
            ref: 'gallerywindow',
            selector: 'gallerywindow'
        },
        {
            ref: 'galleryimageview',
            selector: 'galleryimageview'
        }
    ],
    init: function() {

        this.control({
            'galleryimageview': {
                itemkeydown: this.galleryImageViewUpdate,
                itemclick: this.galleryImageViewUpdate
            },
            '#gallery-reload': {
                click: this.reloadGallery
            },
            '#gallery-btn-addphoto': {
                click: this.loadPhotoForm
            },
            '#galleryform-btn-store': {
                click: this.updatePhoto
            },
            '#galleryform-btn-select': {
                click: this.selectPhoto
            },
            '#gallery-btn-calcel': {
                click: this.galleryBtnCancel
            }
        });
    },
    
    galleryImageViewUpdate: function(view, record, item, index, e) {
        
        if (parseInt(localStorage.getItem('phcp_gitem')) == record.data.id) {
            return false;
        }
        else {
            
            localStorage.setItem('phcp_gitem', record.data.id);

            // category
            let category = '';
            switch (record.data.category) {
                case 'a':
                    category = 'Acabados';
                    break;
                case 'e':
                    category = 'Estructura';
                    break;
                case 'i':
                    category = 'Instalaciones';
                    break;
                default:
                    category = 'Uso General';
                    break;
            }

            let selectPhotoPanel = Ext.create('PHNet.view.gallery.SelectPhotoPanel'),
            win = Ext.getCmp('gallerywindow');
            
            if (Ext.getCmp('gallery-photoform')) {
                let photoform = Ext.getCmp('gallery-photoform');
                win.down('#gallery-right').remove(photoform);
            }
            if (Ext.getCmp('gallery-nophoto-panel')) {
                let nophotopanel = Ext.getCmp('gallery-nophoto-panel');
                win.down('#gallery-right').remove(nophotopanel);
            }
            if (Ext.getCmp('gallery-selectphoto-panel')) {
                let selphotopanel = Ext.getCmp('gallery-selectphoto-panel');
                win.down('#gallery-right').remove(selphotopanel);
            }
            if (Ext.getCmp('gallery-photo-panel')) {
                let photopanel = Ext.getCmp('gallery-photo-panel');
                win.down('#gallery-right').remove(photopanel);
            }
            
            win.down('#gallery-right').add(selectPhotoPanel);
            
            // Set params
            Ext.get('photo-img').setHTML(
                '<img src="/phnet.compras/storage/app/public/products/medium/'+record.data.src+'">'
            );
            Ext.get('photo-link').setHTML(
                '<a href="/phnet.compras/storage/app/public/products/'+record.data.src+'" target="_blank">Ver Foto a tama&ntilde;o completo</a>'
            );
            Ext.get('photo-label-category').setHTML(
                'Categor&iacute;a<br><span>'+category+'</span>'
            );
            if (record.data.description != null && record.data.description != '') {
                Ext.get('photo-label-desc').setHTML(
                    'Descripci&oacute;n<br><span>'+record.data.description+'</span>'
                );
            }   
            win.show();

            Ext.getCmp('gallery-btn-addphoto').setVisible(false);
            Ext.getCmp('galleryform-btn-store').setVisible(false);
            Ext.getCmp('gallery-btn-calcel').setVisible(true).getEl().slideIn('l', {
                duration: 250
            });
            Ext.getCmp('galleryform-btn-select').setVisible(true).getEl().slideIn('l', {
                duration: 250
            });
            //Ext.get('gallery-product').setHTML(record.data.description);
        }
    },

    loadPhotoForm: function() {
        
        if (Ext.getCmp('gallery-photoform')) {
            return false;
        }
        else {
            let galleryRightPanel = Ext.getCmp('gallery-right'),
                photoFormPanel    = Ext.create('PHNet.view.gallery.PhotoForm');

            if (Ext.getCmp('gallery-nophoto-panel')) {
                let galleryNoPhotoPanel = Ext.getCmp('gallery-nophoto-panel');
                galleryRightPanel.remove(galleryNoPhotoPanel);
            }
            if (Ext.getCmp('gallery-photo-panel')) {
                let galleryPhotoPanel = Ext.getCmp('gallery-photo-panel');
                galleryRightPanel.remove(galleryPhotoPanel);
            }

            galleryRightPanel.add(photoFormPanel);
            
            Ext.getCmp('gallery-btn-addphoto').setVisible(false);
            Ext.getCmp('galleryform-btn-select').setVisible(false)
            Ext.getCmp('galleryform-btn-store').setVisible(true).getEl().slideIn('l', {
                duration: 250
            });
            Ext.getCmp('gallery-btn-calcel').setVisible(true).getEl().slideIn('l', {
                duration: 250
            });
        }
    },

    reloadGallery: function() {
        let view      = Ext.getCmp('galleryimageview'),
            store     = view.store,
            selModel  = view.getSelectionModel(),
            selection = selModel.getSelection()[0];

        store.suspendEvents();
        store.clearFilter();
        store.resumeEvents();
        if (selection && store.indexOf(selection) === -1) {
            selModel.clearSelections();
        }
        view.refresh();
        $('#galleryimageview .thumb-wrap').removeClass('x-item-selected');
        store.load();

        Ext.getCmp('gallery-filter-text').setValue(null);
        Ext.getCmp('gallery-filter-category').setValue('');
        Ext.getCmp('gallery-orderby').setValue(null);
        Ext.getBody().unmask();
    },

    galleryBtnCancel: function() {
        
        let win       = Ext.getCmp('gallerywindow'),
            view      = Ext.getCmp('galleryimageview'),
            store     = view.store,
            selModel  = view.getSelectionModel(),
            selection = selModel.getSelection()[0],
            grid      = Ext.getCmp('requestproductsgrid'),
            record    = grid.getSelectionModel().getSelection()[0];

        if (Ext.getCmp('gallery-photoform')) {
            
            if (record.data.photo == null || record.data.photo == '') {

                let photoform = Ext.getCmp('gallery-photoform'),
                    nophotopanel = Ext.create('PHNet.view.gallery.NophotoPanel');

                win.down('#gallery-right').remove(photoform);
                win.down('#gallery-right').add(nophotopanel);
                Ext.get('nophoto-product').setHTML(record.data.description);

                Ext.getCmp('gallery-btn-addphoto').setVisible(true).getEl().slideIn('l', {
                    duration: 250
                });
                Ext.getCmp('galleryform-btn-store').setVisible(false);
                Ext.getCmp('gallery-btn-calcel').setVisible(false);
                Ext.getCmp('galleryform-btn-select').setVisible(false);
            }
            else {
                
                let photopanel = Ext.create('PHNet.view.gallery.PhotoPanel'),
                    photoform  = Ext.getCmp('gallery-photoform');

                win.down('#gallery-right').remove(photoform);
                win.down('#gallery-right').add(photopanel);         
                win.show();
                Ext.get('product-photo-img').setHTML(
                    '<img src="/phnet.compras/storage/app/public/products/medium/'+record.data.photo+'">'
                );
                Ext.get('product-photo-link').setHTML(
                    '<a href="/phnet.compras/storage/app/public/products/'+record.data.photo+'" target="_blank">Ver Foto a tama&ntilde;o completo</a>'
                );
                Ext.get('product-name').setHTML(record.data.description);
                
                Ext.getCmp('gallery-btn-addphoto').setVisible(true).getEl().slideIn('l', {
                    duration: 250
                });
                Ext.getCmp('galleryform-btn-store').setVisible(false);
                Ext.getCmp('gallery-btn-calcel').setVisible(false);
                Ext.getCmp('galleryform-btn-select').setVisible(false);
            }
        }
        else {
            if (record.data.photo == null || record.data.photo == '') {

                let selphotopanel = Ext.getCmp('gallery-selectphoto-panel'),
                    nophotopanel = Ext.create('PHNet.view.gallery.NophotoPanel');
                win.down('#gallery-right').remove(selphotopanel);
                win.down('#gallery-right').add(nophotopanel);
                Ext.get('nophoto-product').setHTML(record.data.description);

                Ext.getCmp('gallery-btn-addphoto').setVisible(true).getEl().slideIn('l', {
                    duration: 250
                });
                Ext.getCmp('galleryform-btn-store').setVisible(false);
                Ext.getCmp('gallery-btn-calcel').setVisible(false);
                Ext.getCmp('galleryform-btn-select').setVisible(false);
            }
            else {
                
                let photopanel = Ext.create('PHNet.view.gallery.PhotoPanel'),
                    selphotopanel = Ext.getCmp('gallery-selectphoto-panel');

                win.down('#gallery-right').remove(selphotopanel);
                win.down('#gallery-right').add(photopanel);         
                win.show();
                Ext.get('product-photo-img').setHTML(
                    '<img src="/phnet.compras/storage/app/public/products/medium/'+record.data.photo+'">'
                );
                Ext.get('product-photo-link').setHTML(
                    '<a href="/phnet.compras/storage/app/public/products/'+record.data.photo+'" target="_blank">Ver Foto a tama&ntilde;o completo</a>'
                );
                Ext.get('product-name').setHTML(record.data.description);
                
                Ext.getCmp('gallery-btn-addphoto').setVisible(true).getEl().slideIn('l', {
                    duration: 250
                });
                Ext.getCmp('galleryform-btn-store').setVisible(false);
                Ext.getCmp('gallery-btn-calcel').setVisible(false);
                Ext.getCmp('galleryform-btn-select').setVisible(false);
            }
        }

        store.resumeEvents();
        if (selection && store.indexOf(selection) === -1) {
            selModel.clearSelections();
        }
        view.refresh();
        $('#galleryimageview .thumb-wrap').removeClass('x-item-selected');

        localStorage.setItem('phcp_gitem', '');
    },

    updatePhoto: function (button) {

        let win       = button.up('window'),
            form      = win.down('#gallery-photoform'),
            values    = form.getValues(),
            id_photo  = values.id_photo,
            photo     = values.photo,
            view      = Ext.getCmp('galleryimageview'),
            store     = view.store
            selModel  = view.getSelectionModel(),
            selection = selModel.getSelection()[0],
            grid      = Ext.getCmp('requestproductsgrid'),
            record    = grid.getSelectionModel().getSelection()[0],
            product   = record.get('id');

        if (photo == null || photo == '') {
            Ext.example.msgError('Error en la operaci\xF3n:', 'Debe seleccionar la Foto que desea Agregar al Sistema.');
            return false;
        }

        if (form.isValid()) {

            button.setText('Enviando...');
            button.setDisabled(true);
            Ext.getCmp('gallery-btn-calcel').setDisabled(true);

            // UPDATE
            if (id_photo > 0) {
                console.log('UPDATE');
            }
            // CREATE
            else {
                form.getForm().submit({
                    method: 'POST',
                    url: '/phnet.compras/public/api/gallery/add',
                    params: {
                        product: product
                    },
                    success: function (form, action) {
                        let data = Ext.decode(action.response.responseText),
                            product = data.product;
                        Ext.example.msgScs('Foto Agregada Satisfactoriamente.');
                        button.setText('<i class="fas fa-check"></i>&nbsp;&nbsp;Aceptar');
                        button.setDisabled(false);
                        Ext.getCmp('gallery-btn-calcel').setDisabled(false);
                        
                        store.suspendEvents();
                        store.clearFilter();
                        store.resumeEvents();
                        if (selection && store.indexOf(selection) === -1) {
                            selModel.clearSelections();
                        }
                        //Ext.fly('galleryimageview');
                        view.refresh();
                        $('#galleryimageview .thumb-wrap').removeClass('x-item-selected');
                        store.load();
                        
                        // load photo panel
                        let photopanel = Ext.create('PHNet.view.gallery.PhotoPanel'),
                            photoform  = Ext.getCmp('gallery-photoform');
                        win.down('#gallery-right').remove(photoform);
                        win.down('#gallery-right').add(photopanel);         
                        win.show();
                        Ext.get('product-photo-img').setHTML(
                            '<img src="/phnet.compras/storage/app/public/products/medium/'+product.photo+'">'
                        );
                        Ext.get('product-photo-link').setHTML(
                            '<a href="/phnet.compras/storage/app/public/products/'+product.photo+'" target="_blank">Ver Foto a tama&ntilde;o completo</a>'
                        );
                        Ext.get('product-name').setHTML(product.description);
                        
                        Ext.getCmp('gallery-btn-addphoto').setVisible(true).getEl().slideIn('l', {
                            duration: 250
                        });
                        Ext.getCmp('galleryform-btn-store').setVisible(false);
                        Ext.getCmp('gallery-btn-calcel').setVisible(false);
                        Ext.getCmp('galleryform-btn-select').setVisible(false);
                    },
                    failure: function(form, action) {
                        let data = Ext.decode(action.response.responseText);
                        Ext.example.msgError('Error en la operaci\xF3n:', data.message);
                        button.setText('<i class="fas fa-check"></i>&nbsp;&nbsp;Aceptar');
                        button.setDisabled(false);
                        Ext.getCmp('gallery-btn-calcel').setDisabled(false);
                    },
                    error: function(xhr){
                        let res = xhr.responseJSON;
                        if($.isEmptyObject(res) == false){
                            $.each(res.errors, function(key, value){
                                Ext.example.msgError('Error en la operaci\xF3n:', key +': '+value);
                            });
                        }
                        button.setText('<i class="fas fa-check"></i>&nbsp;&nbsp;Aceptar');
                        button.setDisabled(false);
                        Ext.getCmp('gallery-btn-calcel').setDisabled(false);
                    }
                });
            }
        }
    },

    selectPhoto: function (button) {

        let win       = button.up('window'),
            view      = Ext.getCmp('galleryimageview'),
            selModel  = view.getSelectionModel(),
            selection = selModel.getSelection()[0],
            photo     = selection.get('id'),
            grid      = Ext.getCmp('requestproductsgrid'),
            record    = grid.getSelectionModel().getSelection()[0],
            product   = record.get('id');

        button.setText('Enviando...');
        button.setDisabled(true);
        Ext.getCmp('gallery-btn-calcel').setDisabled(true);

        Ext.Ajax.request({
            method: 'PUT',
            url: '/phnet.compras/public/api/shopping/request/product/setphoto',
            params: {
                photo: photo,
                product: product
            },
            success: function (response) {
                let res = Ext.decode(response.responseText),
                    product = res.product;
                Ext.example.msgScs('Foto Asignada Satisfactoriamente.');
                button.setText('<i class="fas fa-check"></i>&nbsp;&nbsp;Aceptar');
                button.setDisabled(false);
                Ext.getCmp('gallery-btn-calcel').setDisabled(false);

                localStorage.setItem('phshopping_product', product.id);
                localStorage.setItem('phcp_pphoto', product.photo);
                grid.getStore().load();
                
                // load photo panel
                let photopanel = Ext.create('PHNet.view.gallery.PhotoPanel'),
                    selphotopanel = Ext.getCmp('gallery-selectphoto-panel');

                win.down('#gallery-right').remove(selphotopanel);
                win.down('#gallery-right').add(photopanel);         
                win.show();
                Ext.get('product-photo-img').setHTML(
                    '<img src="/phnet.compras/storage/app/public/products/medium/'+product.photo+'">'
                );
                Ext.get('product-photo-link').setHTML(
                    '<a href="/phnet.compras/storage/app/public/products/'+product.photo+'" target="_blank">Ver Foto a tama&ntilde;o completo</a>'
                );
                Ext.get('product-name').setHTML(product.description);
                
                Ext.getCmp('gallery-btn-addphoto').setVisible(true).getEl().slideIn('l', {
                    duration: 250
                });
                Ext.getCmp('galleryform-btn-store').setVisible(false);
                Ext.getCmp('gallery-btn-calcel').setVisible(false);
                Ext.getCmp('galleryform-btn-select').setVisible(false);
            },
            failure: function(response) {
                //let data = Ext.decode(action.response.responseText);
                //Ext.example.msgError('Error en la operaci\xF3n:', data.message);
                button.setText('<i class="fas fa-check"></i>&nbsp;&nbsp;Aceptar');
                button.setDisabled(false);
                Ext.getCmp('gallery-btn-calcel').setDisabled(false);
            },
            error: function(response){
                /*let res = xhr.responseJSON;
                if($.isEmptyObject(res) == false){
                    $.each(res.errors, function(key, value){
                        Ext.example.msgError('Error en la operaci\xF3n:', key +': '+value);
                    });
                }*/
                button.setText('<i class="fas fa-check"></i>&nbsp;&nbsp;Aceptar');
                button.setDisabled(false);
                Ext.getCmp('gallery-btn-calcel').setDisabled(false);
            }
        });
    }
});