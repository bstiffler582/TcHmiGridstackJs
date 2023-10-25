// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../GridStackProject/Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.48/runtimes/native1.12-tchmi/TcHmi.d.ts" />

/*
 * Generated 9/14/2023 2:23:48 PM
 * Copyright (C) 2023
 */
var TcHmi;
(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    let Controls;
    (function (/** @type {globalThis.TcHmi.Controls} */ Controls) {
        let GridStackFramework;
        (function (GridStackFramework) {
            class GridstackContainer extends TcHmi.Controls.System.TcHmiControl {

                /*
                Attribute philosophy
                --------------------
                - Local variables are not set in the class definition, so they have the value 'undefined'.
                - During compilation, the Framework sets the value that is specified in the HTML or in the theme (possibly 'null') via normal setters.
                - Because of the "changed detection" in the setter, the value is only processed once during compilation.
                - Attention: If we have a Server Binding on an Attribute, the setter will be called once with null to initialize and later with the correct value.
                */

                /**
                 * Constructor of the control
                 * @param {JQuery} element Element from HTML (internal, do not use)
                 * @param {JQuery} pcElement precompiled Element (internal, do not use)
                 * @param {TcHmi.Controls.ControlAttributeList} attrs Attributes defined in HTML in a special format (internal, do not use)
                 * @returns {void}
                 */
                constructor(element, pcElement, attrs) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);

                    this.__grid = null;
                    this.__cache = null;
                }
                /**
                 * Raised after the control was added to the control cache and the constructors of all base classes were called.
                 */
                __previnit() {
                    // Call __previnit of base class
                    super.__previnit();

                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_GridStackFramework_GridstackContainer-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }
                }
                /**
                 * Is called during control initialization after the attribute setters have been called. 
                 * @returns {void}
                 */
                __init() {
                    super.__init();
                }
                /**
                 * Is called by the system after the control instance is inserted into the active DOM.
                 * Is only allowed to be called from the framework itself!
                 */
                __attach() {
                    super.__attach();

                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */

                    // grid-stack container element is deleted with grid.destroy(),
                    // so we must re-create it
                    if (!this.__elementTemplateRoot.children('.grid-stack').length) {
                        this.__elementTemplateRoot.append(
                            "<div class=\"grid-stack\"></div>"
                        );
                    }

                    // gridstack options
                    var options = {
                        draggable: {
                            scroll: true
                        },
                        float: true
                    };

                    this.__grid = GridStack.init(options);

                    // keepAlive is active and cache data available
                    if (this.__keepAlive && this.__cache) {
                        this.__grid.load(this.__cache);
                    }
                }
                /**
                 * Is called by the system when the control instance is no longer part of the active DOM.
                 * Is only allowed to be called from the framework itself!
                 */
                __detach() {
                    super.__detach();

                    /**
                     * Disable everything that is not needed while the control is not part of the active DOM.
                     * For example, there is usually no need to listen for events!
                     */

                    // cache gridstack layout and elements manually
                    // for some reason element content not retained with call to grid.save()??
                    this.__cache = [];
                    this.__grid.save(true, true, (e) => {
                        this.__cache.push({ x: e.x, y: e.y, h: e.h, w: e.w, el: e.el  });
                    });

                    // destroy grid
                    this.__grid.destroy();

                    // remove extra gridstack <style> elements
                    this.__elementTemplateRoot.empty();
                }

                /* internal functions */

                __formatSymbolBinding(x) {

                    // isolate and resolve control symbols to value (e.g. index value)
                    const [match] = (/%ctrl%.*?%\/ctrl%/gm).exec(x.binding);
                    const value = TcHmi.Symbol.readEx(match);
                    const resolved = x.binding.replace(match, value)
                        .replace(/%.*?%/gm, ''); // remove remaining symbol tags '%f%, etc'

                    // append server symbol tags
                    const symbol = (x.serverSymbol) ? '%s%' + resolved + '%/s%' : resolved;

                    return { ...x, binding: symbol };
                }

                /**
                 * Destroy the current control instance.
                 * Will be called automatically if the framework destroys the control instance!
                 */
                destroy() {
                    /**
                     * Ignore while __keepAlive is set to true.
                     */
                    if (this.__keepAlive) {
                        return;
                    }
                    super.destroy();
                    /**
                     * Free resources like child controls etc.
                     */
                }

                /* public functions */

                addWidget() {

                    // add widget selector control
                    const ctrl = TcHmi.ControlFactory.createEx(
                        'TcHmi.Controls.System.TcHmiUserControlHost',
                        'creator_' + tchmi_create_guid(),
                        { 'data-tchmi-target-user-control': './User Controls/UC_WidgetSelector.usercontrol' },
                        this
                    );
                    const [element] = ctrl.getElement();
                    this.__grid.addWidget(element, { w: 2, h: 2, noResize: true, noMove: true });
                }

                createWidget(attributeList, selectorControl) {

                    if (attributeList) {
                        // resolve all attribute parameters
                        const resolved = attributeList.map(this.__formatSymbolBinding);
                        // map to dictionary for ControlFactory.createEx
                        const attributeMap = Object.fromEntries(resolved.map(x => [x.attribute, x.binding]));
                        // create
                        const ctrl = TcHmi.ControlFactory.createEx(
                            'TcHmi.Controls.System.TcHmiUserControlHost',
                            'widget_' + tchmi_create_guid(),
                            attributeMap,
                            this
                        );

                        // get user control host to remove widget selector from grid
                        const [oldElement] = selectorControl.getElement()
                            .parent().parent();

                        // remove from TcHmi control
                        this.__removeChild(selectorControl.__parent);
                        // remove from grid
                        this.__grid.removeWidget(oldElement);

                        // add newly created widget
                        const [newElement] = ctrl.getElement();
                        this.__grid.addWidget(newElement, { w: 2, h: 2 });
                    }
                }

                removeWidget(control) {
                    // get host control
                    const [element] = control.getElement()
                        .parent().parent();
                    // remove
                    this.__removeChild(control.__parent);
                    this.__grid.removeWidget(element);
                }

                /* property accessors */
                getWidgets() {
                    return this.__cache;
                }

                setWidgets(value) {
                    if (value.length)
                        this.__cache = value;
                }

            }
            GridStackFramework.GridstackContainer = GridstackContainer;
        })(GridStackFramework = Controls.GridStackFramework || (Controls.GridStackFramework = {}));
    })(Controls = TcHmi.Controls || (TcHmi.Controls = {}));
})(TcHmi || (TcHmi = {}));

/**
 * Register Control
 */
TcHmi.Controls.registerEx('GridstackContainer', 'TcHmi.Controls.GridStackFramework', TcHmi.Controls.GridStackFramework.GridstackContainer);