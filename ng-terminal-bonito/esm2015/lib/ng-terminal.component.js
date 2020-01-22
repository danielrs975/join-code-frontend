/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Subject } from 'rxjs';
export class NgTerminalComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdGVybWluYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctdGVybWluYWwvIiwic291cmNlcyI6WyJsaWIvbmctdGVybWluYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUE0QixTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUNsSixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUzQyxPQUFPLEVBQUUsT0FBTyxFQUE0QixNQUFNLE1BQU0sQ0FBQztBQVN6RCxNQUFNLE9BQU8sbUJBQW1CO0lBMkM5QjtRQXhDUSxvQkFBZSxHQUFvQixJQUFJLE9BQU8sRUFBVSxDQUFDO1FBQ3pELG9CQUFlLEdBQUcsSUFBSSxPQUFPLEVBQTJDLENBQUM7UUFLekUsTUFBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3RSxrQkFBYSxHQUFrQixFQUFFLENBQUM7UUFHMUMsa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFzQjNCLG9CQUFlLEdBQUksSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUc5QyxvQkFBZSxHQUFJLElBQUksWUFBWSxFQUEyQyxDQUFDO0lBSy9ELENBQUM7Ozs7O0lBNUJqQixJQUNJLFdBQVcsQ0FBQyxFQUFFO1FBQ2hCLElBQUcsSUFBSSxDQUFDLHNCQUFzQixJQUFJLElBQUksRUFBQztZQUNyQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDM0M7UUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsc0JBQXNCLEdB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YSxDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxFQUFFO29CQUMxSCxPQUFPLEtBQUssQ0FBQztpQkFDZDs7b0JBQU0sT0FBTyxJQUFJLENBQUM7YUFDcEI7UUFDSCxDQUFDLEVBQUE7SUFDSCxDQUFDOzs7WUEzTEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxhQUFhO2dCQUN2QixpYkFBMkM7O2FBRTVDOzs7OzswQkFnQkUsS0FBSyxTQUFDLFlBQVk7NkJBY2xCLEtBQUssU0FBQyxlQUFlOzhCQUtyQixNQUFNLFNBQUMsVUFBVTs4QkFHakIsTUFBTSxTQUFDLFVBQVU7MEJBR2pCLFNBQVMsU0FBQyxVQUFVOzs7Ozs7O0lBdkNyQixtQ0FBdUI7Ozs7O0lBQ3ZCLHVDQUEyQjs7Ozs7SUFDM0IsOENBQWlFOzs7OztJQUNqRSw4Q0FBaUY7Ozs7O0lBR2pGLDBEQUFrRDs7Ozs7SUFDbEQsMERBQWtEOzs7OztJQUNsRCxnQ0FBcUY7Ozs7O0lBQ3JGLDRDQUEwQzs7Ozs7SUFDMUMseUNBQXVDOzs7OztJQUN2QyxxREFBNkM7O0lBQzdDLDRDQUEyQjs7SUFxQjNCLDhDQUM4Qzs7SUFFOUMsOENBQytFOztJQUUvRSwwQ0FDd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVGVybWluYWwgfSBmcm9tICd4dGVybSc7XG5pbXBvcnQgeyBGaXRBZGRvbiB9IGZyb20gJ3h0ZXJtLWFkZG9uLWZpdCc7XG5pbXBvcnQgeyBOZ1Rlcm1pbmFsIH0gZnJvbSAnLi9uZy10ZXJtaW5hbCc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IERpc3BsYXlPcHRpb24gfSBmcm9tICcuL2Rpc3BsYXktb3B0aW9uJztcbmltcG9ydCB7IFJlc2l6ZUV2ZW50IH0gZnJvbSAnYW5ndWxhci1yZXNpemFibGUtZWxlbWVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nLXRlcm1pbmFsJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25nLXRlcm1pbmFsLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmctdGVybWluYWwuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5nVGVybWluYWxDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBBZnRlclZpZXdDaGVja2VkLCBOZ1Rlcm1pbmFsLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHRlcm06IFRlcm1pbmFsO1xuICBwcml2YXRlIGZpdEFkZG9uOiBGaXRBZGRvbjtcbiAgcHJpdmF0ZSBrZXlJbnB1dFN1YmplY3Q6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgcHJpdmF0ZSBrZXlFdmVudFN1YmplY3QgPSBuZXcgU3ViamVjdDx7a2V5OiBzdHJpbmc7IGRvbUV2ZW50OiBLZXlib2FyZEV2ZW50O30+KCk7XG4gIFxuICBcbiAgcHJpdmF0ZSBrZXlJbnB1dFN1YmplY3RTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBrZXlFdmVudFN1YmplY3RTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBoID0gTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApO1xuICBwcml2YXRlIGRpc3BsYXlPcHRpb246IERpc3BsYXlPcHRpb24gPSB7fTtcbiAgcHJpdmF0ZSBkYXRhU291cmNlOiBPYnNlcnZhYmxlPHN0cmluZz47XG4gIHByaXZhdGUgZGF0YVNvdXJjZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICB0ZXJtaW5hbFN0eWxlOiBvYmplY3QgPSB7fTtcblxuICBASW5wdXQoJ2RhdGFTb3VyY2UnKVxuICBzZXQgX2RhdGFTb3VyY2UoZHMpIHtcbiAgICBpZih0aGlzLmRhdGFTb3VyY2VTdWJzY3JpcHRpb24gIT0gbnVsbCl7XG4gICAgICB0aGlzLmRhdGFTb3VyY2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5kYXRhU291cmNlID0gZHM7XG4gICAgdGhpcy5kYXRhU291cmNlU3Vic2NyaXB0aW9uID0gdGhpcy5kYXRhU291cmNlLnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgdGhpcy53cml0ZShkYXRhKTtcbiAgICB9KVxuICB9XG4gIGdldCBfZGF0YVNvdXJjZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlO1xuICB9XG5cbiAgQElucHV0KCdkaXNwbGF5T3B0aW9uJylcbiAgc2V0IF9kaXNwbGF5T3B0aW9uKG9wdDogRGlzcGxheU9wdGlvbil7XG4gICAgdGhpcy5zZXREaXNwbGF5T3B0aW9uKG9wdCk7XG4gIH1cblxuICBAT3V0cHV0KCdrZXlJbnB1dCcpXG4gIGtleUlucHV0RW1pdHRlciAgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBAT3V0cHV0KCdrZXlFdmVudCcpXG4gIGtleUV2ZW50RW1pdHRlciAgPSBuZXcgRXZlbnRFbWl0dGVyPHtrZXk6IHN0cmluZzsgZG9tRXZlbnQ6IEtleWJvYXJkRXZlbnQ7fT4oKTtcblxuICBAVmlld0NoaWxkKCd0ZXJtaW5hbCcpIFxuICB0ZXJtaW5hbERpdjogRWxlbWVudFJlZjtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIHByaXZhdGUgb2JzZXJ2YWJsZVNldHVwKCl7XG4gICAgdGhpcy50ZXJtLm9uRGF0YSgoaW5wdXQpID0+IHtcbiAgICAgIHRoaXMua2V5SW5wdXRTdWJqZWN0Lm5leHQoaW5wdXQpO1xuICAgIH0pO1xuICAgIHRoaXMudGVybS5vbktleShlID0+IHtcbiAgICAgIHRoaXMua2V5RXZlbnRTdWJqZWN0Lm5leHQoZSk7XG4gICAgfSlcbiAgICB0aGlzLmtleUlucHV0U3ViamVjdFN1YnNjcmlwdGlvbiA9IHRoaXMua2V5SW5wdXRTdWJqZWN0LnN1YnNjcmliZSgoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5rZXlJbnB1dEVtaXR0ZXIuZW1pdChkYXRhKTtcbiAgICB9KVxuICAgIHRoaXMua2V5RXZlbnRTdWJqZWN0U3Vic2NyaXB0aW9uID0gdGhpcy5rZXlFdmVudFN1YmplY3Quc3Vic2NyaWJlKChlKSA9PiB7XG4gICAgICB0aGlzLmtleUV2ZW50RW1pdHRlci5lbWl0KGUpO1xuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogc2V0IGJsb2NrIG9yIGlubGluZS1ibG9jayB0byAjdGVybWluYWwgZm9yIGZpdHRpbmcgY2xpZW50IG9yIG91dGVyIGVsZW1lbnRcbiAgICovXG4gIHByaXZhdGUgc2V0VGVybWluYWxCbG9jayhpc0Jsb2NrOiBib29sZWFuKXtcbiAgICBpZihpc0Jsb2NrKVxuICAgICAgdGhpcy50ZXJtaW5hbFN0eWxlWydkaXNwbGF5J10gPSAnYmxvY2snO1xuICAgIGVsc2VcbiAgICAgIHRoaXMudGVybWluYWxTdHlsZVsnZGlzcGxheSddID0gJ2lubGluZS1ibG9jayc7XG4gIH1cblxuICAvKipcbiAgICogc2V0IGRpbWVuc2lvbnNcbiAgICovXG4gIHByaXZhdGUgc2V0VGVybWluYWxEaW1lbnNpb24obGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcbiAgICB0aGlzLnRlcm1pbmFsU3R5bGVbJ2xlZnQnXSA9IGAke2xlZnR9cHhgO1xuICAgIHRoaXMudGVybWluYWxTdHlsZVsndG9wJ10gPSBgJHt0b3B9cHhgO1xuICAgIHRoaXMudGVybWluYWxTdHlsZVsnd2lkdGgnXSA9IGAke3dpZHRofXB4YDtcbiAgICB0aGlzLnRlcm1pbmFsU3R5bGVbJ2hlaWdodCddID0gYCR7aGVpZ2h0fXB4YDtcbiAgfVxuICBcbiAgLyoqXG4gICAqIHJlbW92ZSBkaW1lbnNpb25zXG4gICAqL1xuICBwcml2YXRlIHJlbW92ZVRlcm1pbmFsRGltZW5zaW9uKCl7XG4gICAgdGhpcy50ZXJtaW5hbFN0eWxlWydsZWZ0J10gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50ZXJtaW5hbFN0eWxlWyd0b3AnXSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRlcm1pbmFsU3R5bGVbJ3dpZHRoJ10gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50ZXJtaW5hbFN0eWxlWydoZWlnaHQnXSA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIGEgZGltZW5zaW9uIG9mIGRpdiBjaGFuZ2VzLCBmaXQgYSB0ZXJtaW5hbCBpbiBkaXYuXG4gICAqL1xuICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgaWYodGhpcy5kaXNwbGF5T3B0aW9uLmZpeGVkR3JpZCA9PSBudWxsKVxuICAgICAgdGhpcy5maXRBZGRvbi5maXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCBjcmVhdGVzIG5ldyB0ZXJtaW5hbCBpbiAjdGVybWluYWwuXG4gICAqL1xuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5maXRBZGRvbiA9IG5ldyBGaXRBZGRvbigpO1xuICAgIHRoaXMudGVybSA9IG5ldyBUZXJtaW5hbCgpO1xuICAgIHRoaXMudGVybS5vcGVuKHRoaXMudGVybWluYWxEaXYubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy50ZXJtLmxvYWRBZGRvbih0aGlzLmZpdEFkZG9uKTtcbiAgICB0aGlzLm9ic2VydmFibGVTZXR1cCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIGNsZWFuIGFsbCByZXNvdXJjZXNcbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmKHRoaXMua2V5SW5wdXRTdWJqZWN0U3Vic2NyaXB0aW9uKVxuICAgICAgdGhpcy5rZXlJbnB1dFN1YmplY3RTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICBpZih0aGlzLmRhdGFTb3VyY2VTdWJzY3JpcHRpb24pXG4gICAgICB0aGlzLmRhdGFTb3VyY2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICBpZih0aGlzLmtleUV2ZW50U3ViamVjdFN1YnNjcmlwdGlvbilcbiAgICAgIHRoaXMua2V5RXZlbnRTdWJqZWN0U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgaWYodGhpcy50ZXJtKVxuICAgICAgdGhpcy50ZXJtLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHdyaXRlKGNoYXJzOiBzdHJpbmcpIHtcbiAgICB0aGlzLnRlcm0ud3JpdGUoY2hhcnMpO1xuICB9XG4gIFxuICBzZXREaXNwbGF5T3B0aW9uKG9wdDogRGlzcGxheU9wdGlvbil7XG4gICAgaWYob3B0LmZpeGVkR3JpZCAhPSBudWxsKXtcbiAgICAgIGNvbnNvbGUuZGVidWcoXCJyZXNpemFibGUgd2lsbCBiZSBpZ25vcmVkLlwiKVxuICAgICAgdGhpcy50ZXJtLnJlc2l6ZShvcHQuZml4ZWRHcmlkLmNvbHMsIG9wdC5maXhlZEdyaWQucm93cyk7XG4gICAgICB0aGlzLnNldFRlcm1pbmFsQmxvY2soZmFsc2UpO1xuICAgICAgdGhpcy5yZW1vdmVUZXJtaW5hbERpbWVuc2lvbigpO1xuICAgIH1lbHNle1xuICAgICAgdGhpcy5yZW1vdmVUZXJtaW5hbERpbWVuc2lvbigpO1xuICAgICAgdGhpcy5zZXRUZXJtaW5hbEJsb2NrKHRydWUpO1xuICAgIH1cbiAgICB0aGlzLmRpc3BsYXlPcHRpb24gPSBvcHQ7XG4gIH1cblxuICBnZXQga2V5SW5wdXQoKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5rZXlJbnB1dFN1YmplY3Q7XG4gIH1cblxuICBnZXQga2V5RXZlbnRJbnB1dCgpOiBPYnNlcnZhYmxlPHtrZXk6IHN0cmluZzsgZG9tRXZlbnQ6IEtleWJvYXJkRXZlbnQ7fT4ge1xuICAgIHJldHVybiB0aGlzLmtleUV2ZW50U3ViamVjdDtcbiAgfVxuXG4gIGdldCB1bmRlcmx5aW5nKCk6IFRlcm1pbmFsIHtcbiAgICByZXR1cm4gdGhpcy50ZXJtO1xuICB9XG5cbiAgZ2V0IGlzRHJhZ2dhYmxlT25FZGdlQWN0aXZhdGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc3BsYXlPcHRpb24uYWN0aXZhdGVEcmFnZ2FibGVPbkVkZ2UgIT0gdW5kZWZpbmVkICYmIHRoaXMuZGlzcGxheU9wdGlvbi5maXhlZEdyaWQgPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFmdGVyIHVzZXIgY29vcmRpbmF0ZSBkaW1lbnNpb25zIG9mIHRlcm1pbmFsLCBpdCdzIGNhbGxlZC5cbiAgICogQHBhcmFtIGxlZnQgXG4gICAqIEBwYXJhbSB0b3AgXG4gICAqIEBwYXJhbSB3aWR0aCBcbiAgICogQHBhcmFtIGhlaWdodCBcbiAgICovXG4gIG9uUmVzaXplRW5kKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5zZXRUZXJtaW5hbERpbWVuc2lvbihsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJlZm9yZSBvblJlc2l6ZUVuZCBpcyBjYWxsZWQsIGl0IHZhbGlhdGVzIGRpbWVuc2lvbnMgdG8gY2hhbmdlLlxuICAgKiBAcGFyYW0gcmUgZGltZW5zaW9uIHRvIGJlIHN1Ym1pdHRlZCBmcm9tIHJlc2l6YWJsZSBzdHVmZlxuICAgKi9cbiAgdmFsaWRhdG9yRmFjdG9yeSgpOiAocmU6IFJlc2l6ZUV2ZW50KSA9PiBib29sZWFuIHtcbiAgICBjb25zdCBjb21wID0gdGhpcztcbiAgICByZXR1cm4gKHJlOiBSZXNpemVFdmVudCkgPT57IFxuICAgICAgY29uc3QgZGlzcGxheU9wdGlvbiA9IGNvbXAuZGlzcGxheU9wdGlvbjtcbiAgICAgIGlmKGRpc3BsYXlPcHRpb24uYWN0aXZhdGVEcmFnZ2FibGVPbkVkZ2Upe1xuICAgICAgICBsZXQgbGVmdCA9IHJlLnJlY3RhbmdsZS5sZWZ0LCB0b3AgPSByZS5yZWN0YW5nbGUudG9wLCB3aWR0aCA9IHJlLnJlY3RhbmdsZS53aWR0aCwgaGVpZ2h0ID0gcmUucmVjdGFuZ2xlLmhlaWdodDtcbiAgICAgICAgaWYgKCh3aWR0aCA8IGRpc3BsYXlPcHRpb24uYWN0aXZhdGVEcmFnZ2FibGVPbkVkZ2UubWluV2lkdGgpIHx8IChoZWlnaHQgPCBkaXNwbGF5T3B0aW9uLmFjdGl2YXRlRHJhZ2dhYmxlT25FZGdlLm1pbkhlaWdodCkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==