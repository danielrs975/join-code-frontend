/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Subject } from 'rxjs';
var NgTerminalComponent = /** @class */ (function () {
    function NgTerminalComponent() {
        this.keyInputSubject = new Subject();
        this.keyEventSubject = new Subject();
        this.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.displayOption = {};
        this.terminalStyle = {};
        this.keyInputEmitter = new EventEmitter();
        this.keyEventEmitter = new EventEmitter();
    }
    Object.defineProperty(NgTerminalComponent.prototype, "_dataSource", {
        get: /**
         * @return {?}
         */
        function () {
            return this.dataSource;
        },
        set: /**
         * @param {?} ds
         * @return {?}
         */
        function (ds) {
            var _this = this;
            if (this.dataSourceSubscription != null) {
                this.dataSourceSubscription.unsubscribe();
            }
            this.dataSource = ds;
            this.dataSourceSubscription = this.dataSource.subscribe((/**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                _this.write(data);
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTerminalComponent.prototype, "_displayOption", {
        set: /**
         * @param {?} opt
         * @return {?}
         */
        function (opt) {
            this.setDisplayOption(opt);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * @return {?}
     */
    NgTerminalComponent.prototype.observableSetup = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.term.onData((/**
         * @param {?} input
         * @return {?}
         */
        function (input) {
            _this.keyInputSubject.next(input);
        }));
        this.term.onKey((/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            _this.keyEventSubject.next(e);
        }));
        this.keyInputSubjectSubscription = this.keyInputSubject.subscribe((/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            _this.keyInputEmitter.emit(data);
        }));
        this.keyEventSubjectSubscription = this.keyEventSubject.subscribe((/**
         * @param {?} e
         * @return {?}
         */
        function (e) {
            _this.keyEventEmitter.emit(e);
        }));
    };
    /**
     * set block or inline-block to #terminal for fitting client or outer element
     */
    /**
     * set block or inline-block to #terminal for fitting client or outer element
     * @private
     * @param {?} isBlock
     * @return {?}
     */
    NgTerminalComponent.prototype.setTerminalBlock = /**
     * set block or inline-block to #terminal for fitting client or outer element
     * @private
     * @param {?} isBlock
     * @return {?}
     */
    function (isBlock) {
        if (isBlock)
            this.terminalStyle['display'] = 'block';
        else
            this.terminalStyle['display'] = 'inline-block';
    };
    /**
     * set dimensions
     */
    /**
     * set dimensions
     * @private
     * @param {?} left
     * @param {?} top
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    NgTerminalComponent.prototype.setTerminalDimension = /**
     * set dimensions
     * @private
     * @param {?} left
     * @param {?} top
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    function (left, top, width, height) {
        this.terminalStyle['left'] = left + "px";
        this.terminalStyle['top'] = top + "px";
        this.terminalStyle['width'] = width + "px";
        this.terminalStyle['height'] = height + "px";
    };
    /**
     * remove dimensions
     */
    /**
     * remove dimensions
     * @private
     * @return {?}
     */
    NgTerminalComponent.prototype.removeTerminalDimension = /**
     * remove dimensions
     * @private
     * @return {?}
     */
    function () {
        this.terminalStyle['left'] = undefined;
        this.terminalStyle['top'] = undefined;
        this.terminalStyle['width'] = undefined;
        this.terminalStyle['height'] = undefined;
    };
    /**
     * When a dimension of div changes, fit a terminal in div.
     */
    /**
     * When a dimension of div changes, fit a terminal in div.
     * @return {?}
     */
    NgTerminalComponent.prototype.ngAfterViewChecked = /**
     * When a dimension of div changes, fit a terminal in div.
     * @return {?}
     */
    function () {
        if (this.displayOption.fixedGrid == null)
            this.fitAddon.fit();
    };
    /**
     * It creates new terminal in #terminal.
     */
    /**
     * It creates new terminal in #terminal.
     * @return {?}
     */
    NgTerminalComponent.prototype.ngAfterViewInit = /**
     * It creates new terminal in #terminal.
     * @return {?}
     */
    function () {
        this.fitAddon = new FitAddon();
        this.term = new Terminal();
        this.term.open(this.terminalDiv.nativeElement);
        this.term.loadAddon(this.fitAddon);
        this.observableSetup();
    };
    /**
     * clean all resources
     */
    /**
     * clean all resources
     * @return {?}
     */
    NgTerminalComponent.prototype.ngOnDestroy = /**
     * clean all resources
     * @return {?}
     */
    function () {
        if (this.keyInputSubjectSubscription)
            this.keyInputSubjectSubscription.unsubscribe();
        if (this.dataSourceSubscription)
            this.dataSourceSubscription.unsubscribe();
        if (this.keyEventSubjectSubscription)
            this.keyEventSubjectSubscription.unsubscribe();
        if (this.term)
            this.term.dispose();
    };
    /**
     * @param {?} chars
     * @return {?}
     */
    NgTerminalComponent.prototype.write = /**
     * @param {?} chars
     * @return {?}
     */
    function (chars) {
        this.term.write(chars);
    };
    /**
     * @param {?} opt
     * @return {?}
     */
    NgTerminalComponent.prototype.setDisplayOption = /**
     * @param {?} opt
     * @return {?}
     */
    function (opt) {
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
    };
    Object.defineProperty(NgTerminalComponent.prototype, "keyInput", {
        get: /**
         * @return {?}
         */
        function () {
            return this.keyInputSubject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTerminalComponent.prototype, "keyEventInput", {
        get: /**
         * @return {?}
         */
        function () {
            return this.keyEventSubject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTerminalComponent.prototype, "underlying", {
        get: /**
         * @return {?}
         */
        function () {
            return this.term;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgTerminalComponent.prototype, "isDraggableOnEdgeActivated", {
        get: /**
         * @return {?}
         */
        function () {
            return this.displayOption.activateDraggableOnEdge != undefined && this.displayOption.fixedGrid == undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * After user coordinate dimensions of terminal, it's called.
     * @param left
     * @param top
     * @param width
     * @param height
     */
    /**
     * After user coordinate dimensions of terminal, it's called.
     * @param {?} left
     * @param {?} top
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    NgTerminalComponent.prototype.onResizeEnd = /**
     * After user coordinate dimensions of terminal, it's called.
     * @param {?} left
     * @param {?} top
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    function (left, top, width, height) {
        this.setTerminalDimension(left, top, width, height);
    };
    /**
     * Before onResizeEnd is called, it valiates dimensions to change.
     * @param re dimension to be submitted from resizable stuff
     */
    /**
     * Before onResizeEnd is called, it valiates dimensions to change.
     * @return {?}
     */
    NgTerminalComponent.prototype.validatorFactory = /**
     * Before onResizeEnd is called, it valiates dimensions to change.
     * @return {?}
     */
    function () {
        /** @type {?} */
        var comp = this;
        return (/**
         * @param {?} re
         * @return {?}
         */
        function (re) {
            /** @type {?} */
            var displayOption = comp.displayOption;
            if (displayOption.activateDraggableOnEdge) {
                /** @type {?} */
                var left = re.rectangle.left;
                /** @type {?} */
                var top_1 = re.rectangle.top;
                /** @type {?} */
                var width = re.rectangle.width;
                /** @type {?} */
                var height = re.rectangle.height;
                if ((width < displayOption.activateDraggableOnEdge.minWidth) || (height < displayOption.activateDraggableOnEdge.minHeight)) {
                    return false;
                }
                else
                    return true;
            }
        });
    };
    NgTerminalComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ng-terminal',
                    template: "<global-style></global-style>\n\n<div #terminal class=\"terminal-outer\" mwlResizable [ngStyle]=\"terminalStyle\" [validateResize]=\"validatorFactory()\" [enableGhostResize]=\"true\" [resizeEdges]=\"isDraggableOnEdgeActivated ? {bottom: true, right: true} : {bottom: false, right: false}\"\n(resizeEnd)=\"onResizeEnd($event.rectangle.left, $event.rectangle.top, $event.rectangle.width, $event.rectangle.height)\">\n</div>",
                    styles: [".terminal-outer{box-sizing:border-box;height:100%}"]
                }] }
    ];
    /** @nocollapse */
    NgTerminalComponent.ctorParameters = function () { return []; };
    NgTerminalComponent.propDecorators = {
        _dataSource: [{ type: Input, args: ['dataSource',] }],
        _displayOption: [{ type: Input, args: ['displayOption',] }],
        keyInputEmitter: [{ type: Output, args: ['keyInput',] }],
        keyEventEmitter: [{ type: Output, args: ['keyEvent',] }],
        terminalDiv: [{ type: ViewChild, args: ['terminal',] }]
    };
    return NgTerminalComponent;
}());
export { NgTerminalComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdGVybWluYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctdGVybWluYWwvIiwic291cmNlcyI6WyJsaWIvbmctdGVybWluYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUE0QixTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUNsSixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUzQyxPQUFPLEVBQUUsT0FBTyxFQUE0QixNQUFNLE1BQU0sQ0FBQztBQUl6RDtJQWdERTtRQXhDUSxvQkFBZSxHQUFvQixJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ3pELG9CQUFlLEdBQUcsSUFBSSxPQUFPLEVBQTJDLENBQUM7UUFLekUsTUFBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3RSxrQkFBYSxHQUFrQixFQUFFLENBQUM7UUFHMUMsa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFzQjNCLG9CQUFlLEdBQUksSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUc5QyxvQkFBZSxHQUFJLElBQUksWUFBWSxFQUEyQyxDQUFDO0lBSy9ELENBQUM7SUE1QmpCLHNCQUNJLDRDQUFXOzs7O1FBU2Y7WUFDRSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDekIsQ0FBQzs7Ozs7UUFaRCxVQUNnQixFQUFFO1lBRGxCLGlCQVNDO1lBUEMsSUFBRyxJQUFJLENBQUMsc0JBQXNCLElBQUksSUFBSSxFQUFDO2dCQUNyQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDM0M7WUFDRCxJQUFJ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QUk7O29CQUFFLEtBQUcsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUc7O29CQUFFLEtBQUssR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUs7O29CQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU07Z0JBQzlHLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDMUgsT0FBTyxLQUFLLENBQUM7aUJBQ2Q7O29CQUFNLE9BQU8sSUFBSSxDQUFDO2FBQ3BCO1FBQ0gsQ0FBQyxFQUFBO0lBQ0gsQ0FBQzs7Z0JBM0xGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsaWJBQTJDOztpQkFFNUM7Ozs7OzhCQWdCRSxLQUFLLFNBQUMsWUFBWTtpQ0FjbEIsS0FBSyxTQUFDLGVBQWU7a0NBS3JCLE1BQU0sU0FBQyxVQUFVO2tDQUdqQixNQUFNLFNBQUMsVUFBVTs4QkFHakIsU0FBUyxTQUFDLFVBQVU7O0lBK0l2QiwwQkFBQztDQUFBLEFBNUxELElBNExDO1NBdkxZLG1CQUFtQjs7Ozs7O0lBQzlCLG1DQUF1Qjs7Ozs7SUFDdkIsdUNBQTJCOzs7OztJQUMzQiw4Q0FBaUU7Ozs7O0lBQ2pFLDhDQUFpRjs7Ozs7SUFHakYsMERBQWtEOzs7OztJQUNsRCwwREFBa0Q7Ozs7O0lBQ2xELGdDQUFxRjs7Ozs7SUFDckYsNENBQTBDOzs7OztJQUMxQyx5Q0FBdUM7Ozs7O0lBQ3ZDLHFEQUE2Qzs7SUFDN0MsNENBQTJCOztJQXFCM0IsOENBQzhDOztJQUU5Qyw4Q0FDK0U7O0lBRS9FLDBDQUN3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBBZnRlclZpZXdDaGVja2VkLCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUZXJtaW5hbCB9IGZyb20gJ3h0ZXJtJztcbmltcG9ydCB7IEZpdEFkZG9uIH0gZnJvbSAneHRlcm0tYWRkb24tZml0JztcbmltcG9ydCB7IE5nVGVybWluYWwgfSBmcm9tICcuL25nLXRlcm1pbmFsJztcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgRGlzcGxheU9wdGlvbiB9IGZyb20gJy4vZGlzcGxheS1vcHRpb24nO1xuaW1wb3J0IHsgUmVzaXplRXZlbnQgfSBmcm9tICdhbmd1bGFyLXJlc2l6YWJsZS1lbGVtZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmctdGVybWluYWwnLFxuICB0ZW1wbGF0ZVVybDogJy4vbmctdGVybWluYWwuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZy10ZXJtaW5hbC5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmdUZXJtaW5hbENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIEFmdGVyVmlld0NoZWNrZWQsIE5nVGVybWluYWwsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgdGVybTogVGVybWluYWw7XG4gIHByaXZhdGUgZml0QWRkb246IEZpdEFkZG9uO1xuICBwcml2YXRlIGtleUlucHV0U3ViamVjdDogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICBwcml2YXRlIGtleUV2ZW50U3ViamVjdCA9IG5ldyBTdWJqZWN0PHtrZXk6IHN0cmluZzsgZG9tRXZlbnQ6IEtleWJvYXJkRXZlbnQ7fT4oKTtcbiAgXG4gIFxuICBwcml2YXRlIGtleUlucHV0U3ViamVjdFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIGtleUV2ZW50U3ViamVjdFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMCk7XG4gIHByaXZhdGUgZGlzcGxheU9wdGlvbjogRGlzcGxheU9wdGlvbiA9IHt9O1xuICBwcml2YXRlIGRhdGFTb3VyY2U6IE9ic2VydmFibGU8c3RyaW5nPjtcbiAgcHJpdmF0ZSBkYXRhU291cmNlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHRlcm1pbmFsU3R5bGU6IG9iamVjdCA9IHt9O1xuXG4gIEBJbnB1dCgnZGF0YVNvdXJjZScpXG4gIHNldCBfZGF0YVNvdXJjZShkcykge1xuICAgIGlmKHRoaXMuZGF0YVNvdXJjZVN1YnNjcmlwdGlvbiAhPSBudWxsKXtcbiAgICAgIHRoaXMuZGF0YVNvdXJjZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLmRhdGFTb3VyY2UgPSBkcztcbiAgICB0aGlzLmRhdGFTb3VyY2VTdWJzY3JpcHRpb24gPSB0aGlzLmRhdGFTb3VyY2Uuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICB0aGlzLndyaXRlKGRhdGEpO1xuICAgIH0pXG4gIH1cbiAgZ2V0IF9kYXRhU291cmNlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2U7XG4gIH1cblxuICBASW5wdXQoJ2Rpc3BsYXlPcHRpb24nKVxuICBzZXQgX2Rpc3BsYXlPcHRpb24ob3B0OiBEaXNwbGF5T3B0aW9uKXtcbiAgICB0aGlzLnNldERpc3BsYXlPcHRpb24ob3B0KTtcbiAgfVxuXG4gIEBPdXRwdXQoJ2tleUlucHV0JylcbiAga2V5SW5wdXRFbWl0dGVyICA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIEBPdXRwdXQoJ2tleUV2ZW50JylcbiAga2V5RXZlbnRFbWl0dGVyICA9IG5ldyBFdmVudEVtaXR0ZXI8e2tleTogc3RyaW5nOyBkb21FdmVudDogS2V5Ym9hcmRFdmVudDt9PigpO1xuXG4gIEBWaWV3Q2hpbGQoJ3Rlcm1pbmFsJykgXG4gIHRlcm1pbmFsRGl2OiBFbGVtZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgcHJpdmF0ZSBvYnNlcnZhYmxlU2V0dXAoKXtcbiAgICB0aGlzLnRlcm0ub25EYXRhKChpbnB1dCkgPT4ge1xuICAgICAgdGhpcy5rZXlJbnB1dFN1YmplY3QubmV4dChpbnB1dCk7XG4gICAgfSk7XG4gICAgdGhpcy50ZXJtLm9uS2V5KGUgPT4ge1xuICAgICAgdGhpcy5rZXlFdmVudFN1YmplY3QubmV4dChlKTtcbiAgICB9KVxuICAgIHRoaXMua2V5SW5wdXRTdWJqZWN0U3Vic2NyaXB0aW9uID0gdGhpcy5rZXlJbnB1dFN1YmplY3Quc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICB0aGlzLmtleUlucHV0RW1pdHRlci5lbWl0KGRhdGEpO1xuICAgIH0pXG4gICAgdGhpcy5rZXlFdmVudFN1YmplY3RTdWJzY3JpcHRpb24gPSB0aGlzLmtleUV2ZW50U3ViamVjdC5zdWJzY3JpYmUoKGUpID0+IHtcbiAgICAgIHRoaXMua2V5RXZlbnRFbWl0dGVyLmVtaXQoZSk7XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgYmxvY2sgb3IgaW5saW5lLWJsb2NrIHRvICN0ZXJtaW5hbCBmb3IgZml0dGluZyBjbGllbnQgb3Igb3V0ZXIgZWxlbWVudFxuICAgKi9cbiAgcHJpdmF0ZSBzZXRUZXJtaW5hbEJsb2NrKGlzQmxvY2s6IGJvb2xlYW4pe1xuICAgIGlmKGlzQmxvY2spXG4gICAgICB0aGlzLnRlcm1pbmFsU3R5bGVbJ2Rpc3BsYXknXSA9ICdibG9jayc7XG4gICAgZWxzZVxuICAgICAgdGhpcy50ZXJtaW5hbFN0eWxlWydkaXNwbGF5J10gPSAnaW5saW5lLWJsb2NrJztcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXQgZGltZW5zaW9uc1xuICAgKi9cbiAgcHJpdmF0ZSBzZXRUZXJtaW5hbERpbWVuc2lvbihsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xuICAgIHRoaXMudGVybWluYWxTdHlsZVsnbGVmdCddID0gYCR7bGVmdH1weGA7XG4gICAgdGhpcy50ZXJtaW5hbFN0eWxlWyd0b3AnXSA9IGAke3RvcH1weGA7XG4gICAgdGhpcy50ZXJtaW5hbFN0eWxlWyd3aWR0aCddID0gYCR7d2lkdGh9cHhgO1xuICAgIHRoaXMudGVybWluYWxTdHlsZVsnaGVpZ2h0J10gPSBgJHtoZWlnaHR9cHhgO1xuICB9XG4gIFxuICAvKipcbiAgICogcmVtb3ZlIGRpbWVuc2lvbnNcbiAgICovXG4gIHByaXZhdGUgcmVtb3ZlVGVybWluYWxEaW1lbnNpb24oKXtcbiAgICB0aGlzLnRlcm1pbmFsU3R5bGVbJ2xlZnQnXSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRlcm1pbmFsU3R5bGVbJ3RvcCddID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGVybWluYWxTdHlsZVsnd2lkdGgnXSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRlcm1pbmFsU3R5bGVbJ2hlaWdodCddID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gYSBkaW1lbnNpb24gb2YgZGl2IGNoYW5nZXMsIGZpdCBhIHRlcm1pbmFsIGluIGRpdi5cbiAgICovXG4gIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICBpZih0aGlzLmRpc3BsYXlPcHRpb24uZml4ZWRHcmlkID09IG51bGwpXG4gICAgICB0aGlzLmZpdEFkZG9uLmZpdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0IGNyZWF0ZXMgbmV3IHRlcm1pbmFsIGluICN0ZXJtaW5hbC5cbiAgICovXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmZpdEFkZG9uID0gbmV3IEZpdEFkZG9uKCk7XG4gICAgdGhpcy50ZXJtID0gbmV3IFRlcm1pbmFsKCk7XG4gICAgdGhpcy50ZXJtLm9wZW4odGhpcy50ZXJtaW5hbERpdi5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLnRlcm0ubG9hZEFkZG9uKHRoaXMuZml0QWRkb24pO1xuICAgIHRoaXMub2JzZXJ2YWJsZVNldHVwKCk7XG4gIH1cblxuICAvKipcbiAgICogY2xlYW4gYWxsIHJlc291cmNlc1xuICAgKi9cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYodGhpcy5rZXlJbnB1dFN1YmplY3RTdWJzY3JpcHRpb24pXG4gICAgICB0aGlzLmtleUlucHV0U3ViamVjdFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIGlmKHRoaXMuZGF0YVNvdXJjZVN1YnNjcmlwdGlvbilcbiAgICAgIHRoaXMuZGF0YVNvdXJjZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIGlmKHRoaXMua2V5RXZlbnRTdWJqZWN0U3Vic2NyaXB0aW9uKVxuICAgICAgdGhpcy5rZXlFdmVudFN1YmplY3RTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICBpZih0aGlzLnRlcm0pXG4gICAgICB0aGlzLnRlcm0uZGlzcG9zZSgpO1xuICB9XG5cbiAgd3JpdGUoY2hhcnM6IHN0cmluZykge1xuICAgIHRoaXMudGVybS53cml0ZShjaGFycyk7XG4gIH1cbiAgXG4gIHNldERpc3BsYXlPcHRpb24ob3B0OiBEaXNwbGF5T3B0aW9uKXtcbiAgICBpZihvcHQuZml4ZWRHcmlkICE9IG51bGwpe1xuICAgICAgY29uc29sZS5kZWJ1ZyhcInJlc2l6YWJsZSB3aWxsIGJlIGlnbm9yZWQuXCIpXG4gICAgICB0aGlzLnRlcm0ucmVzaXplKG9wdC5maXhlZEdyaWQuY29scywgb3B0LmZpeGVkR3JpZC5yb3dzKTtcbiAgICAgIHRoaXMuc2V0VGVybWluYWxCbG9jayhmYWxzZSk7XG4gICAgICB0aGlzLnJlbW92ZVRlcm1pbmFsRGltZW5zaW9uKCk7XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLnJlbW92ZVRlcm1pbmFsRGltZW5zaW9uKCk7XG4gICAgICB0aGlzLnNldFRlcm1pbmFsQmxvY2sodHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMuZGlzcGxheU9wdGlvbiA9IG9wdDtcbiAgfVxuXG4gIGdldCBrZXlJbnB1dCgpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmtleUlucHV0U3ViamVjdDtcbiAgfVxuXG4gIGdldCBrZXlFdmVudElucHV0KCk6IE9ic2VydmFibGU8e2tleTogc3RyaW5nOyBkb21FdmVudDogS2V5Ym9hcmRFdmVudDt9PiB7XG4gICAgcmV0dXJuIHRoaXMua2V5RXZlbnRTdWJqZWN0O1xuICB9XG5cbiAgZ2V0IHVuZGVybHlpbmcoKTogVGVybWluYWwge1xuICAgIHJldHVybiB0aGlzLnRlcm07XG4gIH1cblxuICBnZXQgaXNEcmFnZ2FibGVPbkVkZ2VBY3RpdmF0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheU9wdGlvbi5hY3RpdmF0ZURyYWdnYWJsZU9uRWRnZSAhPSB1bmRlZmluZWQgJiYgdGhpcy5kaXNwbGF5T3B0aW9uLmZpeGVkR3JpZCA9PSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQWZ0ZXIgdXNlciBjb29yZGluYXRlIGRpbWVuc2lvbnMgb2YgdGVybWluYWwsIGl0J3MgY2FsbGVkLlxuICAgKiBAcGFyYW0gbGVmdCBcbiAgICogQHBhcmFtIHRvcCBcbiAgICogQHBhcmFtIHdpZHRoIFxuICAgKiBAcGFyYW0gaGVpZ2h0IFxuICAgKi9cbiAgb25SZXNpemVFbmQobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNldFRlcm1pbmFsRGltZW5zaW9uKGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCk7XG4gIH1cblxuICAvKipcbiAgICogQmVmb3JlIG9uUmVzaXplRW5kIGlzIGNhbGxlZCwgaXQgdmFsaWF0ZXMgZGltZW5zaW9ucyB0byBjaGFuZ2UuXG4gICAqIEBwYXJhbSByZSBkaW1lbnNpb24gdG8gYmUgc3VibWl0dGVkIGZyb20gcmVzaXphYmxlIHN0dWZmXG4gICAqL1xuICB2YWxpZGF0b3JGYWN0b3J5KCk6IChyZTogUmVzaXplRXZlbnQpID0+IGJvb2xlYW4ge1xuICAgIGNvbnN0IGNvbXAgPSB0aGlzO1xuICAgIHJldHVybiAocmU6IFJlc2l6ZUV2ZW50KSA9PnsgXG4gICAgICBjb25zdCBkaXNwbGF5T3B0aW9uID0gY29tcC5kaXNwbGF5T3B0aW9uO1xuICAgICAgaWYoZGlzcGxheU9wdGlvbi5hY3RpdmF0ZURyYWdnYWJsZU9uRWRnZSl7XG4gICAgICAgIGxldCBsZWZ0ID0gcmUucmVjdGFuZ2xlLmxlZnQsIHRvcCA9IHJlLnJlY3RhbmdsZS50b3AsIHdpZHRoID0gcmUucmVjdGFuZ2xlLndpZHRoLCBoZWlnaHQgPSByZS5yZWN0YW5nbGUuaGVpZ2h0O1xuICAgICAgICBpZiAoKHdpZHRoIDwgZGlzcGxheU9wdGlvbi5hY3RpdmF0ZURyYWdnYWJsZU9uRWRnZS5taW5XaWR0aCkgfHwgKGhlaWdodCA8IGRpc3BsYXlPcHRpb24uYWN0aXZhdGVEcmFnZ2FibGVPbkVkZ2UubWluSGVpZ2h0KSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19