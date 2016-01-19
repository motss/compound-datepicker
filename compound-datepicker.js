var _monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"],_dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];Polymer({is:"compound-datepicker",hostAttributes:{role:"datepicker"},behaviors:[Polymer.NeonAnimationRunnerBehavior],properties:{firstDayOfWeek:{type:Number,value:0},disableDays:{type:Array,value:function(){return[0,6,4]}},minDate:{type:String,value:"1000-00-01"},maxDate:{type:String,value:"9999-99-99"},format:{type:String,value:"yyyy-mm-dd"},date:{type:String,value:function(){var e=new Date;return[e.getFullYear(),("0"+e.getMonth()+1).slice(-2),e.getDate()].join("-")},notify:!0},showLongDate:{type:Boolean,value:!1},_daysOfWeek:{type:Array,value:function(){return["S","M","T","W","T","F","S"]},computed:"_computeDaysOfWeek(firstDayOfWeek)"},_daysOfMonth:{type:Array,value:function(){return[1,2,3,4,5]}},_listOfYears:{type:Array,value:function(){for(var e=[],t=1900,a=t;2100>=a;a++)e.push({year:a});return e}},_activeView:{type:String,value:"calendar"},_activeYear:{type:Number,value:function(){return(new Date).getFullYear()}},_activeMonth:{type:Number,value:function(){return(new Date).getMonth()}},_isIncrementMonth:{type:Boolean,value:!1},_isDecrementMonth:{type:Boolean,value:!1},_selectedYear:{type:Number,value:(new Date).getFullYear()},_selectedMonth:{type:Number,value:(new Date).getMonth()},_selectedDate:{type:Number,value:(new Date).getDate()},_selectedDaysOfWeek:{type:String,value:function(){var e=(new Date).getDay();return 0>e&&(e=6),_dayNames[e].slice(0,3)}},_chosenListOfYears:{type:Object,observer:"_chosenListOfYearsChanged"},_chosenDaysOfMonth:{type:Number,value:99},_isListUpdated:{type:Boolean,value:!1},_isSelectedDateConfirmed:{type:Boolean,value:!1},_format:{type:Object,value:function(){return{y:"yyyy",m:"mm",d:"dd",s1:"-",s2:"-"}}}},observers:["_computeDaysOfMonth(_activeYear, _activeMonth, firstDayOfWeek)","_updateList(_activeView)","_computeSeparateFormat(format)","_computeShowLongDate(showLongDate)"],ready:function(){},attached:function(){this.set("animationConfig",{incrementEntry:[{name:"slide-from-right-animation",node:this.$.daysOfWeek},{name:"slide-from-right-animation",node:this.$.daysOfMonth},{name:"datepicker-slide-from-right-animation",node:this.$.navMonthYear}],decrementEntry:[{name:"slide-from-left-animation",node:this.$.daysOfWeek},{name:"slide-from-left-animation",node:this.$.daysOfMonth},{name:"datepicker-slide-from-left-animation",node:this.$.navMonthYear}]}),this.$.listOfYears.selectItem((new Date).getFullYear()-1900);var e=this.getEffectiveChildren(),t=Polymer.dom(e[0]).querySelectorAll("paper-button");if(e[0]&&t.length>0){for(var a=0;a<t.length;a++)t[a].hasAttribute("dialog-confirm")&&(t[a].addEventListener("tap",this._confirmSelectedDate.bind(this)),t[a].addEventListener("transitionend",this.updateBindDate.bind(this)));this.updateStyles({"--compound-datepicker-height":"441px"})}},detached:function(){},_computeDaysOfMonth:function(e,t,a){function i(e,t){var a=31;return 1===t?a=1===new Date(e,1,29).getMonth()?29:28:(3===t||5===t||8===t||10===t)&&(a=30),a}var n=new Date(e,t,1).getDay(),s=[],o=i(e,t);a>0&&7>a&&(n-=a,n=0>n?7+n:n);for(var r=0,h=1-n;42>r;r++,h++)s.push(r>=n&n+o>r?h:"");this.set("_chosenDaysOfMonth",this._computeChosenDaysOfMonth(s)),this.set("_daysOfMonth",s)},_setUpdateMonth:function(e){for(var t=e.target;t&&"PAPER-ICON-BUTTON"!==t.tagName;)t=t.parentElement;t&&t.hasAttribute("button-action")&&("increment"===t.getAttribute("button-action")?this.set("_isIncrementMonth",!0):this.set("_isDecrementMonth",!0))},_incrementMonth:function(){if(this._isIncrementMonth){var e=this._activeMonth;++e>11&&this._activeYear++,this.set("_activeMonth",e>11?0:e),this.cancelAnimation(),this.playAnimation("incrementEntry"),this.set("_isIncrementMonth",!1)}},_decrementMonth:function(){if(this._isDecrementMonth){var e=this._activeMonth;--e<0&&this._activeYear--,this.set("_activeMonth",0>e?11:e),this.cancelAnimation(),this.playAnimation("decrementEntry"),this.set("_isDecrementMonth",!1)}},_computeMonthName:function(e){return _monthNames[e]},_computeShortMonthName:function(e){return _monthNames[e].slice(0,3)},_chooseDaysOfMonth:function(e){var t=e.target;if(t&&_.isNumber(t.date)&&!t.classList.contains("is-disabled-day")){if(99!==this._chosenDaysOfMonth){var a=Polymer.dom(this.$.daysOfMonth).querySelectorAll("div");this.toggleClass("chosen-days-of-month",!1,a[this._chosenDaysOfMonth])}this.toggleClass("chosen-days-of-month",!0,t),this.set("_chosenDaysOfMonth",t.index),this.set("_selectedDate",t.date),this.set("_selectedYear",this._activeYear),this.set("_selectedMonth",this._activeMonth),this.set("_selectedDaysOfWeek",this._computeShortDayName(t.index%7))}},_computeShortDayName:function(e){return _dayNames[e].slice(0,3)},_isToday:function(e,t,a){var i=new Date;return e===i.getDate()&&t===i.getFullYear()&&a===i.getMonth()?" is-today":""},_isEmptyDate:function(e){return _.isNumber(e)?"":" is-non-selectable"},_isChosenDaysOfMonth:function(e){return 99!==this._chosenDaysOfMonth&&this._activeYear===this._selectedYear&&this._activeMonth===this._selectedMonth&&e===this._selectedDate?" chosen-days-of-month":""},_isDisableDays:function(e,t,a,i,n){var s,o,r=this.disableDays.some(function(t){return t===e%7});if(_.isNumber(n)){var h=this._computeMinDate(a),c=this._computeMaxDate(i),d=new Date(this._activeYear,this._activeMonth,n);_.isUndefined(h)||(s=d<new Date(h.year,h.month-1,h.date)),_.isUndefined(c)||(o=d>new Date(c.year,c.month-1,c.date))}return r||s||o?" is-disabled-day":""},_chooseListOfYears:function(e){return _.isNull(e)||_.isEmpty(e)?(this.$.listOfYears.selectItem(this._activeYear-1900),void this.async(function(){this.$.listOfYears.notifyResize()})):(this.set("_selectedYear",e.year),void this.set("_activeYear",e.year))},_isListOfYearsSelected:function(e){return e?" is-selected":""},_chosenListOfYearsChanged:function(e,t){this._chooseListOfYears(e),"year"===this._activeView&&this.set("_activeView","calendar")},_computeDaysOfWeek:function(e){if(e>0&&7>e){var t=["S","M","T","W","T","F","S"],a=t.splice(e);return a.push(t),_.flatten(a)}return["S","M","T","W","T","F","S"]},_computeChosenDaysOfMonth:function(e){var t=e.indexOf(this._selectedDate);return t>0?t:void 0},_computeMinDate:function(e){var t=/(\d{4})[^a-zA-Z0-9]+(\d{2})[^a-zA-Z0-9]+(\d{2})/i,a=t.exec(e);return null!==a?{year:parseInt(a[1]),month:parseInt(a[2]),date:parseInt(a[3])}:void 0},_computeMaxDate:function(e){var t=/(\d{4})[^a-zA-Z0-9]+(\d{2})[^a-zA-Z0-9]+(\d{2})/i,a=t.exec(e);return null!==a?{year:parseInt(a[1]),month:parseInt(a[2]),date:parseInt(a[3])}:void 0},_updateList:function(e){"year"===e&&(this._isListUpdated?(this.$.listOfYears.scrollToIndex(this._activeYear-1900-2),this.$.listOfYears.notifyResize()):(this.$.listOfYears.scrollToIndex(this._activeYear-1900),this.$.listOfYears.notifyResize(),this.set("_isListUpdated",!0)))},_computeSeparateFormat:function(e){var t=/(yyyy|yy)[^a-zA-Z0-9]+(mmmm|mmm|mm|m)[^a-zA-Z0-9]+(do|dd|d)/i,a=/\w+([^a-zA-Z0-9]+)\w+([^a-zA-Z0-9]+)\w+/i,i=t.exec(e),n=a.exec(e);null!==i&&null!==n&&(this.set("_format.y",i[1]),this.set("_format.m",i[2]),this.set("_format.d",i[3]),this.set("_format.s1",n[1]),this.set("_format.s2",n[2]))},_bindSelectedFulldate:function(e,t,a,i){if(this.showLongDate){var n=new Date(e,t,a).toString().slice(0,15);return n.slice(0,3)+","+n.slice(3)}var s=e,o=_monthNames[t],r=a,h="";if("yy"===i.y&&(s=e%100),"mmm"===i.m?o=o.slice(0,3):"mm"===i.m?o=("0"+(t+1)).slice(-2):"m"===i.m&&(o=t+1),"do"===i.d){var c=r%10,d=c>3?"th":["th","st","nd","rd"][c];(11===r||12==r||13===r)&&(d="th"),r+=d}else"dd"===i.d&&(r=("0"+r).slice(-2));return h=[s,i.s1,o,i.s2,r].join("")},_confirmSelectedDate:function(e){this._isSelectedDateConfirmed||this.set("_isSelectedDateConfirmed",!0)},updateBindDate:function(){this._isSelectedDateConfirmed&&(this._bindSelectedFulldate(this._selectedYear,this._selectedMonth,this._selectedDate,this._format),this.set("_isSelectedDateConfirmed",!1))},_computeShowLongDate:function(e){if(e){var t=_.isUndefined(this._selectedDate)?(new Date).toString().slice(0,15):new Date(this._selectedYear,this._selectedMonth,this._selectedDate).toString().slice(0,15);this.set("date",t.slice(0,3)+","+t.slice(3))}else this.set("date",this._bindSelectedFulldate(this._selectedYear,this._selectedMonth,this._selectedDate,this._format))}});