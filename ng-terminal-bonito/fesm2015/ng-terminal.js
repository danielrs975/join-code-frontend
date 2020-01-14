import { Injectable, defineInjectable, EventEmitter, Component, Input, Output, ViewChild, ViewEncapsulation, NgModule } from '@angular/core';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Subject } from 'rxjs';
import { ResizableModule } from 'angular-resizable-element';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgTerminalService {
    constructor() { }
}
NgTerminalService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
NgTerminalService.ctorParameters = () => [];
/** @nocollapse */ NgTerminalService.ngInjectableDef = defineInjectable({ factory: function NgTerminalService_Factory() { return new NgTerminalService(); }, token: NgTerminalService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgTerminalComponent {
    constructor() {
        this.keyInputSubject = new Subject();
        this.keyEventSubject = new Subject();
        this.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.displayOption = {};
        this.terminalStyle = {};
        this.keyInputEmitter = new EventEmitter();
        this.keyEventEmitter = new EventEmitter();
    }
    /**
     * @param {?} ds
     * @return {?}
     */
    set _dataSource(ds) {
        if (this.dataSourceSubscription != null) {
            this.dataSourceSubscription.unsubscribe();
        }
        this.dataSource = ds;
        this.dataSourceSubscription = this.dataSource.subscribe((/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            this.write(data);
        }));
    }
    /**
     * @return {?}
     */
    get _dataSource() {
        return this.dataSource;
    }
    /**
     * @param {?} opt
     * @return {?}
     */
    set _displayOption(opt) {
        this.setDisplayOption(opt);
    }
    /**
     * @private
     * @return {?}
     */
    observableSetup() {
        this.term.onData((/**
         * @param {?} input
         * @return {?}
         */
        (input) => {
            this.keyInputSubject.next(input);
        }));
        this.term.onKey((/**
         * @param {?} e
         * @return {?}
         */
        e => {
            this.keyEventSubject.next(e);
        }));
        this.keyInputSubjectSubscription = this.keyInputSubject.subscribe((/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            this.keyInputEmitter.emit(data);
        }));
        this.keyEventSubjectSubscription = this.keyEventSubject.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        (e) => {
            this.keyEventEmitter.emit(e);
        }));
    }
    /**
     * set block or inline-block to #terminal for fitting client or outer element
     * @private
     * @param {?} isBlock
     * @return {?}
     */
    setTerminalBlock(isBlock) {
        if (isBlock)
            this.terminalStyle['display'] = 'block';
        else
            this.terminalStyle['display'] = 'inline-block';
    }
    /**
     * set dimensions
     * @private
     * @param {?} left
     * @param {?} top
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    setTerminalDimension(left, top, width, height) {
        this.terminalStyle['left'] = `${left}px`;
        this.terminalStyle['top'] = `${top}px`;
        this.terminalStyle['width'] = `${width}px`;
        this.terminalStyle['height'] = `${height}px`;
    }
    /**
     * remove dimensions
     * @private
     * @return {?}
     */
    removeTerminalDimension() {
        this.terminalStyle['left'] = undefined;
        this.terminalStyle['top'] = undefined;
        this.terminalStyle['width'] = undefined;
        this.terminalStyle['height'] = undefined;
    }
    /**
     * When a dimension of div changes, fit a terminal in div.
     * @return {?}
     */
    ngAfterViewChecked() {
        if (this.displayOption.fixedGrid == null)
            this.fitAddon.fit();
    }
    /**
     * It creates new terminal in #terminal.
     * @return {?}
     */
    ngAfterViewInit() {
        this.fitAddon = new FitAddon();
        this.term = new Terminal();
        this.term.open(this.terminalDiv.nativeElement);
        this.term.loadAddon(this.fitAddon);
        this.observableSetup();
    }
    /**
     * clean all resources
     * @return {?}
     */
    ngOnDestroy() {
        if (this.keyInputSubjectSubscription)
            this.keyInputSubjectSubscription.unsubscribe();
        if (this.dataSourceSubscription)
            this.dataSourceSubscription.unsubscribe();
        if (this.keyEventSubjectSubscription)
            this.keyEventSubjectSubscription.unsubscribe();
        if (this.term)
            this.term.dispose();
    }
    /**
     * @param {?} chars
     * @return {?}
     */
    write(chars) {
        this.term.write(chars);
    }
    /**
     * @param {?} opt
     * @return {?}
     */
    setDisplayOption(opt) {
        if (opt.fixedGrid != null) {
            console.debug("resizable will be ignored.");
            this.term.resize(opt.fixedGrid.cols, opt.fixedGrid.rows);
            this.setTerminalBlock(false);
            this.removeTerminalDimension();
        }
        else {
            this.removeTerminalDimension();
            this.setTerminalBlock(true);
        }
        this.displayOption = opt;
    }
    /**
     * @return {?}
     */
    get keyInput() {
        return this.keyInputSubject;
    }
    /**
     * @return {?}
     */
    get keyEventInput() {
        return this.keyEventSubject;
    }
    /**
     * @return {?}
     */
    get underlying() {
        return this.term;
    }
    /**
     * @return {?}
     */
    get isDraggableOnEdgeActivated() {
        return this.displayOption.activateDraggableOnEdge != undefined && this.displayOption.fixedGrid == undefined;
    }
    /**
     * After user coordinate dimensions of terminal, it's called.
     * @param {?} left
     * @param {?} top
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    onResizeEnd(left, top, width, height) {
        this.setTerminalDimension(left, top, width, height);
    }
    /**
     * Before onResizeEnd is called, it valiates dimensions to change.
     * @return {?}
     */
    validatorFactory() {
        /** @type {?} */
        const comp = this;
        return (/**
         * @param {?} re
         * @return {?}
         */
        (re) => {
            /** @type {?} */
            const displayOption = comp.displayOption;
            if (displayOption.activateDraggableOnEdge) {
                /** @type {?} */
                let left = re.rectangle.left;
                /** @type {?} */
                let top = re.rectangle.top;
                /** @type {?} */
                let width = re.rectangle.width;
                /** @type {?} */
                let height = re.rectangle.height;
                if ((width < displayOption.activateDraggableOnEdge.minWidth) || (height < displayOption.activateDraggableOnEdge.minHeight)) {
                    return false;
                }
                else
                    return true;
            }
        });
    }
}
NgTerminalComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng-terminal',
                template: "<global-style></global-style>\n\n<div #terminal class=\"terminal-outer\" mwlResizable [ngStyle]=\"terminalStyle\" [validateResize]=\"validatorFactory()\" [enableGhostResize]=\"true\" [resizeEdges]=\"isDraggableOnEdgeActivated ? {bottom: true, right: true} : {bottom: false, right: false}\"\n(resizeEnd)=\"onResizeEnd($event.rectangle.left, $event.rectangle.top, $event.rectangle.width, $event.rectangle.height)\">\n</div>",
                styles: [".terminal-outer{box-sizing:border-box;height:100%}"]
            }] }
];
/** @nocollapse */
NgTerminalComponent.ctorParameters = () => [];
NgTerminalComponent.propDecorators = {
    _dataSource: [{ type: Input, args: ['dataSource',] }],
    _displayOption: [{ type: Input, args: ['displayOption',] }],
    keyInputEmitter: [{ type: Output, args: ['keyInput',] }],
    keyEventEmitter: [{ type: Output, args: ['keyEvent',] }],
    terminalDiv: [{ type: ViewChild, args: ['terminal',] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgTerminalComponent.prototype.term;
    /**
     * @type {?}
     * @private
     */
    NgTerminalComponent.prototype.fitAddon;
    /**
     * @type {?}
     * @private
     */
    NgTerminalComponent.prototype.keyInputSubject;
    /**
     * @type {?}
     * @private
     */
    NgTerminalComponent.prototype.keyEventSubject;
    /**
     * @type {?}
     * @private
     */
    NgTerminalComponent.prototype.keyInputSubjectSubscription;
    /**
     * @type {?}
     * @private
     */
    NgTerminalComponent.prototype.keyEventSubjectSubscription;
    /**
     * @type {?}
     * @private
     */
    NgTerminalComponent.prototype.h;
    /**
     * @type {?}
     * @private
     */
    NgTerminalComponent.prototype.displayOption;
    /**
     * @type {?}
     * @private
     */
    NgTerminalComponent.prototype.dataSource;
    /**
     * @type {?}
     * @private
     */
    NgTerminalComponent.prototype.dataSourceSubscription;
    /** @type {?} */
    NgTerminalComponent.prototype.terminalStyle;
    /** @type {?} */
    NgTerminalComponent.prototype.keyInputEmitter;
    /** @type {?} */
    NgTerminalComponent.prototype.keyEventEmitter;
    /** @type {?} */
    NgTerminalComponent.prototype.terminalDiv;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GlobalStyleComponent {
    constructor() { }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
GlobalStyleComponent.decorators = [
    { type: Component, args: [{
                selector: 'global-style',
                template: "",
                //global styles
                encapsulation: ViewEncapsulation.None,
                styles: [".xterm{-webkit-font-feature-settings:\"liga\" 0;font-feature-settings:\"liga\" 0;position:relative;-moz-user-select:none;user-select:none;-ms-user-select:none;-webkit-user-select:none;cursor:text}.xterm.focus,.xterm:focus{outline:0}.xterm .xterm-helpers{position:absolute;top:0;z-index:5}.xterm .xterm-helper-textarea{position:absolute;opacity:0;left:-9999em;top:0;width:0;height:0;z-index:-5;white-space:nowrap;overflow:hidden;resize:none}.xterm .composition-view{background:#000;color:#fff;display:none;position:absolute;white-space:nowrap;z-index:1}.xterm .composition-view.active{display:block}.xterm .xterm-viewport{background-color:#000;overflow-y:scroll;cursor:default;position:absolute;right:0;left:0;top:0;bottom:0}.xterm .xterm-screen{position:relative}.xterm .xterm-screen canvas{position:absolute;left:0;top:0}.xterm .xterm-scroll-area{visibility:hidden}.xterm-char-measure-element{display:inline-block;visibility:hidden;position:absolute;top:0;left:-9999em;line-height:normal}.xterm.enable-mouse-events{cursor:default}.xterm.xterm-cursor-pointer{cursor:pointer}.xterm.column-select.focus{cursor:crosshair}.xterm .xterm-accessibility,.xterm .xterm-message{position:absolute;left:0;top:0;bottom:0;right:0;z-index:10;color:transparent}.xterm .live-region{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}.xterm-dim{opacity:.5}.xterm-underline{text-decoration:underline}"]
            }] }
];
/** @nocollapse */
GlobalStyleComponent.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgTerminalModule {
}
NgTerminalModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgTerminalComponent, GlobalStyleComponent],
                imports: [
                    ResizableModule, CommonModule
                ],
                exports: [NgTerminalComponent]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 *
 * It is a CSI sequences generator
 * https://invisible-island.net/xterm/ctlseqs/ctlseqs.html#h2-Functions-using-CSI-_-ordered-by-the-final-character_s_
 * @type {?}
 */
let CSI = '\x9b';
class FunctionsUsingCSI {
    /**
     *  CSI Ps \@  Insert Ps (Blank) Character(s) (default = 1) (ICH).
     *
     *
     * @param {?} count
     * @return {?}
     */
    static insertBlank(count) {
        return `${CSI}${count}@`;
    }
    /**
         *  CSI Ps SP @ */
    /**
     *  CSI Ps A  Cursor Up Ps Times (default = 1) (CUU).
     * \x9b3A
     * @param {?} count
     * @return {?}
     */
    static cursorUp(count) {
        return `${CSI}${count}A`;
    }
    /**
         *  CSI Ps SP A */
    /**
     *  CSI Ps B  Cursor Down Ps Times (default = 1) (CUD).
     * \x9b3B
     * @param {?} count
     * @return {?}
     */
    static cursorDown(count) {
        return `${CSI}${count}B`;
    }
    /**
     *  CSI Ps C  Cursor Forward Ps Times (default = 1) (CUF).
     * \x9b3C
     * @param {?} count
     * @return {?}
     */
    static cursorForward(count) {
        return `${CSI}${count}C`;
    }
    /**
     *  CSI Ps D  Cursor Backward Ps Times (default = 1) (CUB).
     * \x9b3D
     * @param {?} count
     * @return {?}
     */
    static cursorBackward(count) {
        return `${CSI}${count}D`;
    }
    /**
     *  CSI Ps E  Cursor Next Line Ps Times (default = 1) (CNL).
     * \x9b3E
     *
     * @param {?} count
     * @return {?}
     */
    static cursorNextLine(count) {
        return `${CSI}${count}E`;
    }
    /**
     *  CSI Ps F  Cursor Preceding Line Ps Times (default = 1) (CPL).
     * \x9b3F
     *
     * @param {?} count
     * @return {?}
     */
    static cursorPrecedingLine(count) {
        return `${CSI}${count}F`;
    }
    /**
     *  CSI Ps G  Cursor Character Absolute  [column] (default = [row,1]) (CHA).
     *  \x9b9G
     *
     * @param {?} count
     * @return {?}
     */
    static cursorColumn(count) {
        return `${CSI}${count}G`;
    }
    /**
     *  CSI Ps ; Ps H  Cursor Position [row;column] (default = [1,1]) (CUP).
     * \x9b2;2H
     *
     * @param {?} row
     * @param {?} col
     * @return {?}
     */
    static cursorPosition(row, col) {
        return `${CSI}${row};${col}H`;
    }
    /**
         *  CSI Ps I  Cursor Forward Tabulation Ps tab stops (default = 1) (CHT). */
    /**
     *  CSI Ps J  Erase in Display (ED), VT100.
     *      Ps = 0  -> Erase Below (default).
     *      Ps = 1  -> Erase Above.
     *      Ps = 2  -> Erase All.
     *      Ps = 3  -> Erase Saved Lines (xterm).
     * \x9b2J
     *
     * @param {?} category
     * @return {?}
     */
    static eraseInDisplay(category) {
        return `${CSI}${category}J`;
    }
    /**
     *  CSI ? Ps J
     *  Erase in Display (DECSED), VT220.
     *    Ps = 0  -> Selective Erase Below (default).
     *    Ps = 1  -> Selective Erase Above.
     *    Ps = 2  -> Selective Erase All.
     *    Ps = 3  -> Selective Erase Saved Lines (xterm).
     * \x9b?2J
     *
     * @param {?} category
     * @return {?}
     */
    static eraseSelectiveThingsInDisplay(category) {
        return `${CSI}?${category}J`;
    }
    /**
     *  CSI Ps K
     *   Erase in Line (EL), VT100.
     *     Ps = 0  -> Erase to Right (default).
     *     Ps = 1  -> Erase to Left.
     *     Ps = 2  -> Erase All.
     * \x9b?1K
     *
     * @param {?} category
     * @return {?}
     */
    static eraseInLine(category) {
        return `${CSI}${category}K`;
    }
    /**
     *  CSI ? Ps K
     *    Erase in Line (DECSEL), VT220.
     *      Ps = 0  -> Selective Erase to Right (default).
     *      Ps = 1  -> Selective Erase to Left.
     *      Ps = 2  -> Selective Erase All.
     * \x9b?1K
     *
     * @param {?} category
     * @return {?}
     */
    static eraseSelectiveThingsInLine(category) {
        return `${CSI}?${category}K`;
    }
    /**
     *  CSI Ps L  Insert Ps Line(s) (default = 1) (IL).
     * \x9b2L
     *
     * @param {?} count
     * @return {?}
     */
    static insertLines(count) {
        return `${CSI}${count}L`;
    }
    /**
     *  CSI Ps M  Delete Ps Line(s) (default = 1) (DL).
     * \x9b2M
     *
     * @param {?} count
     * @return {?}
     */
    static deleteLines(count) {
        return `${CSI}${count}M`;
    }
    /**
     *  CSI Ps P  Delete Ps Character(s) (default = 1) (DCH).
     * \x9b2P
     *
     * @param {?} count
     * @return {?}
     */
    static deleteCharacter(count) {
        return `${CSI}${count}P`;
    }
    /**
     *  CSI Ps S  Scroll up Ps lines (default = 1) (SU), VT420, ECMA-48.
     * \x9b2S
     *
     * @param {?} count
     * @return {?}
     */
    static scrollUpLines(count) {
        return `${CSI}${count}S`;
    }
    /**
         *  CSI ? Pi ; Pa ; Pv S */
    /**
     *  CSI Ps T  Scroll down Ps lines (default = 1) (SD), VT420.
     * \x9b2T
     *
     * @param {?} count
     * @return {?}
     */
    static scrollDownLines(count) {
        return `${CSI}${count}T`;
    }
    /**
         *  CSI Ps ; Ps ; Ps ; Ps ; Ps T */
    /**
         *  CSI > Ps ; Ps T */
    /**
     *  CSI Ps X  Erase Ps Character(s) (default = 1) (ECH).
     * \x9b2X
     *
     * @param {?} count
     * @return {?}
     */
    static eraseCharacters(count) {
        return `${CSI}${count}X`;
    }
}
/** @enum {number} */
const KindOfEraseInDisplay = {
    Below: 0, Above: 1, All: 2, SavedLines: 3,
};
KindOfEraseInDisplay[KindOfEraseInDisplay.Below] = 'Below';
KindOfEraseInDisplay[KindOfEraseInDisplay.Above] = 'Above';
KindOfEraseInDisplay[KindOfEraseInDisplay.All] = 'All';
KindOfEraseInDisplay[KindOfEraseInDisplay.SavedLines] = 'SavedLines';
/** @enum {number} */
const KindOfEraseInLine = {
    Right: 0, Left: 1, All: 2,
};
KindOfEraseInLine[KindOfEraseInLine.Right] = 'Right';
KindOfEraseInLine[KindOfEraseInLine.Left] = 'Left';
KindOfEraseInLine[KindOfEraseInLine.All] = 'All';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function NgTerminal() { }
if (false) {
    /**
     * getter only provided
     * A observable to emit printable characters when a user typed on the div for the xterm
     * @deprecated since version 2.1.0
     * @type {?}
     */
    NgTerminal.prototype.keyInput;
    /**
     * getter only provided
     * A observable to emit keys and keyboard event when a user typed on the div for the xterm
     * @type {?}
     */
    NgTerminal.prototype.keyEventInput;
    /**
     * getter only provided
     * return the core object of the terminal where you can control everything directly
     * @type {?}
     */
    NgTerminal.prototype.underlying;
    /**
     * write print charactors or control sequences to the xterm directly
     * @param {?} chars charactors to write
     * @return {?}
     */
    NgTerminal.prototype.write = function (chars) { };
    /**
     * change row, col, draggable
     * @param {?} opt
     * @return {?}
     */
    NgTerminal.prototype.setDisplayOption = function (opt) { };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * options for dimensions of terminal.
 * fixedGrid has high priority than activateDraggableOnEdge's
 * @record
 */
function DisplayOption() { }
if (false) {
    /** @type {?|undefined} */
    DisplayOption.prototype.fixedGrid;
    /** @type {?|undefined} */
    DisplayOption.prototype.activateDraggableOnEdge;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { FunctionsUsingCSI, KindOfEraseInDisplay, KindOfEraseInLine, NgTerminalComponent, NgTerminalModule, NgTerminalService, GlobalStyleComponent as ɵa };
//# sourceMappingURL=ng-terminal.js.map
