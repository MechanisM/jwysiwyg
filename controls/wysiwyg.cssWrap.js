/**
 * Controls: Element CSS Wrapper plugin
 *
 * Depends on jWYSIWYG
 * 
 * By Yotam Bar-On (https://github.com/tudmotu)
 */
(function ($) {
	if (undefined === $.wysiwyg) {
		throw "wysiwyg.cssWrap.js depends on $.wysiwyg";
	}

	if (!$.wysiwyg.controls) {
		$.wysiwyg.controls = {};
	}

	/*
	 * Wysiwyg namespace: public properties and methods
	 */
	$.wysiwyg.controls.cssWrap = {
		init: function (Wysiwyg) {
			var self = this, formWrapHtml, key, translation,
			dialogReplacements = {
				legend	: "Wrap Element",
				wrapperType : "Wrapper Type",
				ID : "ID",
				class : "Class",
				submit  : "Wrap",
				reset   : "Cancel"
			};

			formWrapHtml = '<form class="wysiwyg"><fieldset><legend>{legend}</legend>' +
				'<div class="dialogRow"><label>{wrapperType}: &nbsp;<select name="type"><option value="div">Div</option><option value="span">Span</option></select></label></div>' +
				'<div class="dialogRow"><label>{ID}: &nbsp;<input name="id" type="text" /></label></div>' + 
				'<div class="dialogRow"><label>{class}: &nbsp;<input name="class" type="text" /></label></div>' +
				'<input type="submit" id="submitDialog" class="button" value="{submit}"/></label>' +
				'<input type="reset" id="cancelDialog" value="{reset}"/></fieldset></form>';

			for (key in dialogReplacements) {
				if ($.wysiwyg.i18n) {
					translation = $.wysiwyg.i18n.t(dialogReplacements[key]);
					if (translation === dialogReplacements[key]) { // if not translated search in dialogs 
						translation = $.wysiwyg.i18n.t(dialogReplacements[key], "dialogs");
					}
					dialogReplacements[key] = translation;
				}
				formWrapHtml = formWrapHtml.replace("{" + key + "}", dialogReplacements[key]);
			}
			if (!$(".wysiwyg-dialog-wrapper").length) {
				$('<div class="wysiwyg-dialog-wrapper">'+formWrapHtml+'</div>').appendTo("body");
				$(".wysiwyg-dialog-wrapper").dialog({
					modal: true,
					open: function (ev, ui) {
						$this = $(this);
						var range	= Wysiwyg.getInternalRange(), common;
						// We make sure that there is some selection:
						if (range) {
							if ($.browser.msie) {
								Wysiwyg.ui.focus();
							}
							common	= $(range.commonAncestorContainer);
						} else {
							alert("You must select some elements before you can wrap them.");
							$this.dialog("close");
							return 0;
						}
						var $nodeName = range.commonAncestorContainer.nodeName.toLowerCase();
						// If the selection is already a .wysiwygCssWrapper, then we want to change it and not double-wrap it.
						if (common.parent(".wysiwygCssWrapper").length) {
							$this.find("input[name=id]").val(common.parent(".wysiwygCssWrapper").attr("id"));
							$this.find("input[name=class]").val(common.parent(".wysiwygCssWrapper").attr("class").replace('wysiwygCssWrapper ', ''));							
						}
						// Submit button.
						$("form.wysiwyg").find("#submitDialog").click(function(e) {
							e.preventDefault();
							var $wrapper = $(".wysiwyg-dialog-wrapper").find("select[name=type]").val();
							var $id = $(".wysiwyg-dialog-wrapper").find("input[name=id]").val();
							var $class = $(".wysiwyg-dialog-wrapper").find("input[name=class]").val();
							if ($nodeName !== "body") {
								// If the selection is already a .wysiwygCssWrapper, then we want to change it and not double-wrap it.
								if (common.parent(".wysiwygCssWrapper").length) {
									//alert(common.parent(".wysiwygCssWrapper").attr("id"));
									common.parent(".wysiwygCssWrapper").attr("id", $class);
									common.parent(".wysiwygCssWrapper").attr("class", $class);
								} else {
									common.wrap('<'+$wrapper+' id="'+$id+'" class="'+"wysiwygCssWrapper "+$class+'"/>');
								}
							}
							$this.dialog("close");
						});
						// Cancel button.
						$("form.wysiwyg").find("#cancelDialog").click(function(e) {
							e.preventDefault();
							$this.dialog("close");
							return 1;
						});
					},
					close: function () {
						$(this).remove();
					}
				});
				Wysiwyg.saveContent();
			}
			$(Wysiwyg.editorDoc).trigger("editorRefresh.wysiwyg");
			return 1;
		}
	}
})(jQuery);
