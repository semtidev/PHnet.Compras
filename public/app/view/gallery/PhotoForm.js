Ext.Loader.setConfig({enabled: true});
Ext.define('PHNet.view.gallery.PhotoForm', {
    extend: 'Ext.form.Panel',
    id: 'gallery-photoform',
    width: 260,
    bodyPadding: 20,
    bodyStyle: {
        "background-color": "#F7FBFE"
    },
    listeners: {
        'afterrender': function(panel) {
            panel.getEl().slideIn('l', {
                easing: 'easeIn',
                duration: 200
            });
        }
    },
    layout: 'anchor',
    title: 'Agregar Foto',
    defaultType: 'textfield',
    items: [
        {
            xtype: 'textfield',
            name: 'id_photo',
            hidden: true
        }, {
            xtype: 'textfield',
            name: 'photo',
            id: 'gallery-photoform-photo',
            hidden: true
        }, {
            xtype: 'component',
            id: 'img-photo-prev',
            html: '<span class="fa-stack fa-5x" style="margin: 25px auto auto 25px">' +
                    '<i class="fas fa-camera fa-stack-1x"></i>' +
                    '<i class="fas fa-ban fa-stack-2x" style="color:Tomato"></i>' +
                '</span>',
            width: 215,
            height: 180,
            style: {
                border: '#ccc 1px solid'
            }
        },{
            xtype: 'component',
            html: '<form id="load-temp-photo" enctype="multipart/form-data" class="form-horizontal" role="form">' +
                        '<input name="_token" value="'+localStorage.getItem('phshopping_form')+'" type="hidden">' +
                        '<input name="user" type="hidden" value="'+ localStorage.getItem('phshopping_userid') +'">' +
                        '<input id="nrandom" name="nrandom" type="hidden">' +
                        '<input id="loadphoto_prev" name="loadphoto_prev" type="hidden">' +
                        '<span class="fileinput-button">' +
                            '<span id="search-btn">Buscar Foto...</span>' +
                            '<input id="product-photo" type="file" name="photo"' +
                            'accept="image/png, image/jpeg" title=" ">' +
                        '</span>' +
                   '</form>' +
                '<span class="search-warning">Formatos: PNG, JPEG&nbsp;&nbsp;-&nbsp;&nbsp;Tama\xF1o: 1 Mb</span>',
            height: 70

        },{
            xtype: 'textfield',
            allowBlank: false,
            maxLength: 20,
            flex: 1,
            anchor: '100%',
            margin: '0 5 12 0',
            name: 'name',
            emptyText: 'Nombre Corto (20 caracteres)',
            afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required"> *</span>',
            style: {
                height: '35px'
            },
            listeners: {
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        Ext.getCmp('photoform-description').focus();
                    }
                }
            }
        }, {
            xtype: 'textareafield',
            height: 80,
            id: 'photoform-description',
            allowBlank: true,
            flex: 1,
            anchor: '100%',
            margin: '0 5 0 0',
            name: 'description',
            emptyText: 'Descripci\xF3n del producto',
            afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required"> *</span>',
            listeners: {
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        Ext.getCmp('photoform-category').focus();
                    }
                }
            }
        }, {
            xtype: 'combo',
            id: 'photoform-category',
            queryMode: 'local',
            forceSelection: true,
            editable: false,
            allowBlank: false,
            flex: 1,
            anchor: '100%',
            margin: '5 5 0 0',
            name: 'category',
            displayField: 'name',
            valueField: 'value',
            emptyText: 'Elija la categor\xEDa...',
            store: Ext.create('Ext.data.Store', {
                fields : ['name', 'value'],
                data   : [
                    {name : 'General', value: 'g'},
                    {name : 'Acabados',  value: 'a'},
                    {name : 'Estructura',  value: 'e'},
                    {name : 'Instalaciones',  value: 'i'}
                ]
            }),
            afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required"> *</span>'
        }
    ]
})