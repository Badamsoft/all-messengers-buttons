jQuery(document).ready(function($) {
    'use strict';

    (function() {
        const $wrap = $('.amb-admin-wrap');
        if (!$wrap.length) {
            return;
        }

        const $noticesHost = $wrap.find('> .amb-wp-notices').first();
        if (!$noticesHost.length) {
            return;
        }

        const moveNoticesIntoPlugin = () => {
            const $scope = $('#wpbody-content');
            const $root = $scope.length ? $scope : $(document);

            const $notices = $root
                .find('.notice, .error, .updated, .update-nag, .notice-error, .notice-warning, .notice-success, .notice-info')
                .filter(':visible')
                .not($wrap.find('.notice, .error, .updated, .update-nag, .notice-error, .notice-warning, .notice-success, .notice-info'));

            if ($notices.length) {
                $notices.appendTo($noticesHost);
            }
        };

        moveNoticesIntoPlugin();
        setTimeout(moveNoticesIntoPlugin, 0);
        setTimeout(moveNoticesIntoPlugin, 250);
    })();

    // Initialize color pickers
    if ($.fn && typeof $.fn.wpColorPicker === 'function') {
        $('.amb-color-picker').wpColorPicker();
    }

    // Tab switching
    $('.amb-tab').on('click', function() {
        const tabId = $(this).data('tab');
        
        $('.amb-tab').removeClass('active');
        $(this).addClass('active');
        
        $('.amb-tab-content').removeClass('active');
        $('#tab-' + tabId).addClass('active');
    });

    // Slider value display
    $('input[name="offset"]').on('input', function() {
        $('#offset-value').text($(this).val());
    });

    // Messenger toggle details
    $('.amb-toggle-details').on('click', function(e) {
        e.stopPropagation();
        const $item = $(this).closest('.amb-messenger-item');
        const $details = $item.find('.amb-messenger-details');
        
        $item.toggleClass('open');
        $details.slideToggle(300);
    });

    // Messenger enable/disable
    $('.amb-messenger-toggle').on('change', function() {
        const $item = $(this).closest('.amb-messenger-item');
        const isEnabled = $(this).is(':checked');
        
        $item.find('input, button').not('.amb-messenger-toggle, .amb-toggle-details').prop('disabled', !isEnabled);
    });

    // Custom icon upload
    $('.amb-upload-icon').on('click', function(e) {
        e.preventDefault();
        
        const $button = $(this);
        const messengerType = $button.data('type');
        const $input = $button.siblings('.amb-custom-icon-input');
        
        const mediaUploader = wp.media({
            title: 'Choose an icon',
            button: {
                text: 'Use this icon'
            },
            multiple: false,
            library: {
                type: 'image'
            }
        });
        
        mediaUploader.on('select', function() {
            const attachment = mediaUploader.state().get('selection').first().toJSON();
            $input.val(attachment.url);
            
            // Update preview
            const $item = $button.closest('.amb-messenger-item');
            const $preview = $item.find('.amb-custom-icon-preview');
            
            if ($preview.length) {
                $preview.find('img').attr('src', attachment.url);
            } else {
                const previewHtml = `
                    <div class="amb-custom-icon-preview">
                        <img src="${attachment.url}" alt="Custom icon">
                        <button type="button" class="button amb-remove-icon">Remove</button>
                    </div>
                `;
                $button.before(previewHtml);
            }
            
            $button.html('<span class="dashicons dashicons-upload"></span> Replace icon');
            
            // Update messenger icon in header
            const $headerIcon = $item.find('.amb-messenger-icon');
            $headerIcon.html(`<img src="${attachment.url}" alt="Custom icon">`);
        });
        
        mediaUploader.open();
    });

    // Remove custom icon
    $(document).on('click', '.amb-remove-icon', function() {
        const $button = $(this);
        const $preview = $button.closest('.amb-custom-icon-preview');
        const $item = $button.closest('.amb-messenger-item');
        const messengerType = $item.find('.amb-upload-icon').data('type');
        const $input = $item.find('.amb-custom-icon-input');
        
        $input.val('');
        $preview.remove();
        
        $item.find('.amb-upload-icon').html('<span class="dashicons dashicons-upload"></span> Upload file');
        
        // Restore default icon
        const $headerIcon = $item.find('.amb-messenger-icon');
        $headerIcon.html(`<span class="amb-icon-${messengerType}"></span>`);
    });

    // Preview mode toggle
    $('input[name="preview_mode"]').on('change', function() {
        updatePreview();
    });

    // Update preview on settings change
    $('input[name="position"], input[name="offset"], input[name="primary_color"], input[name="hover_color"], input[name="icon_size"], input[name="enable_animation"], input[name="show_text"]').on('change input', function() {
        updatePreview();
    });

    $('.amb-messenger-toggle').on('change', function() {
        updatePreview();
    });

    // Save settings
    $('#amb-save-settings, #amb-save-settings-bottom').on('click', function(e) {
        e.preventDefault();
        
        const $button = $(this);
        const originalText = $button.html();
        
        $button.prop('disabled', true).html('<span class="dashicons dashicons-update-alt"></span> Saving...');
        
        const options = collectSettings();
        
        $.ajax({
            url: ambAdmin.ajaxurl,
            type: 'POST',
            data: {
                action: 'amb_save_settings',
                nonce: ambAdmin.nonce,
                options: options
            },
            success: function(response) {
                if (response.success) {
                    $button.html('<span class="dashicons dashicons-yes"></span> Saved!');
                    
                    setTimeout(function() {
                        $button.prop('disabled', false).html(originalText);
                    }, 2000);
                } else {
                    alert('Settings save error: ' + response.data);
                    $button.prop('disabled', false).html(originalText);
                }
            },
            error: function() {
                alert('Settings save error');
                $button.prop('disabled', false).html(originalText);
            }
        });
    });

    // Collect all settings
    function collectSettings() {
        const options = {
            position: $('input[name="position"]:checked').val(),
            offset: parseInt($('input[name="offset"]').val()),
            display_mode: $('select[name="display_mode"]').val(),
            primary_color: $('input[name="primary_color"]').val(),
            hover_color: $('input[name="hover_color"]').val(),
            icon_style: $('select[name="icon_style"]').val(),
            icon_size: parseInt($('input[name="icon_size"]').val()),
            enable_animation: $('input[name="enable_animation"]').is(':checked'),
            show_text: $('input[name="show_text"]').is(':checked'),
            enable_analytics: $('input[name="enable_analytics"]').is(':checked'),
            event_category: $('input[name="event_category"]').val(),
            custom_css: $('textarea[name="custom_css"]').val(),
            messengers: {}
        };
        
        // Collect messenger settings
        $('.amb-messenger-item').each(function() {
            const $item = $(this);
            const type = $item.find('.amb-upload-icon').data('type');
            
            options.messengers[type] = {
                enabled: $item.find('input[name="messengers[' + type + '][enabled]"]').is(':checked'),
                value: $item.find('input[name="messengers[' + type + '][value]"]').val(),
                custom_icon: $item.find('input[name="messengers[' + type + '][custom_icon]"]').val()
            };
        });
        
        return options;
    }

    // Update preview
    function updatePreview() {
        const $container = $('#widget-preview');
        if (!$container.length) {
            console.error('Preview container not found');
            return;
        }
        
        const previewMode = $('input[name="preview_mode"]:checked').val() || 'desktop';
        const position = $('input[name="position"]:checked').val() || 'right-bottom';
        const offset = parseInt($('input[name="offset"]').val()) || 20;
        const primaryColor = $('input[name="primary_color"]').val() || '#6366f1';
        const hoverColor = $('input[name="hover_color"]').val() || '#4f46e5';
        const iconSize = parseInt($('input[name="icon_size"]').val()) || 56;
        const enableAnimation = $('input[name="enable_animation"]').is(':checked');
        const showText = $('input[name="show_text"]').is(':checked');
        
        const enabledMessengers = [];
        $('.amb-messenger-toggle:checked').each(function() {
            const $item = $(this).closest('.amb-messenger-item');
            const $uploadBtn = $item.find('.amb-upload-icon');
            if ($uploadBtn.length) {
                const type = $uploadBtn.data('type');
                const name = $item.find('.amb-messenger-name').text();
                const customIcon = $item.find('.amb-custom-icon-input').val();
                
                enabledMessengers.push({
                    type: type,
                    name: name,
                    customIcon: customIcon
                });
            }
        });
        
        // Fallback: if no messengers are enabled, add defaults for preview
        if (enabledMessengers.length === 0) {
            enabledMessengers.push(
                { type: 'whatsapp', name: 'WhatsApp', customIcon: '' },
                { type: 'telegram', name: 'Telegram', customIcon: '' },
                { type: 'viber', name: 'Viber', customIcon: '' }
            );
        }

        renderPreview(previewMode, position, offset, primaryColor, hoverColor, iconSize, enableAnimation, showText, enabledMessengers);
    }

    // Render preview
    function renderPreview(mode, position, offset, primaryColor, hoverColor, iconSize, enableAnimation, showText, messengers) {
        const $container = $('#widget-preview');
        
        try {
            let html = '';
            if (mode === 'mobile') {
                html = renderMobilePreview(position, offset, primaryColor, hoverColor, iconSize, enableAnimation, showText, messengers);
            } else {
                html = renderDesktopPreview(position, offset, primaryColor, hoverColor, iconSize, enableAnimation, showText, messengers);
            }
            
            $container.html(html);
            
            // Add click handler to toggle widget
            $container.find('.amb-preview-toggle').on('click', function() {
                $(this).closest('.amb-preview-widget').toggleClass('open');
            });
        } catch (e) {
            console.error('Preview render error:', e);
            $container.html('<div style="padding: 20px; color: red;">Preview error: ' + e.message + '</div>');
        }
    }

    // Render mobile preview
    function renderMobilePreview(position, offset, primaryColor, hoverColor, iconSize, enableAnimation, showText, messengers) {
        const scaledIconSize = iconSize * 0.7;
        const positionClass = 'amb-position-' + position;
        
        return `
            <div class="amb-mobile-mockup">
                <div class="amb-phone-frame">
                    <div class="amb-phone-screen">
                        <div class="amb-status-bar">
                            <span>9:41</span>
                            <div class="amb-status-icons">
                                <div class="amb-battery"></div>
                            </div>
                        </div>
                        <div class="amb-page-content">
                            <div class="amb-content-placeholder"></div>
                            <div class="amb-content-placeholder short"></div>
                            <div class="amb-content-placeholder"></div>
                            <div class="amb-content-image"></div>
                            ${renderWidget(positionClass, offset, primaryColor, hoverColor, scaledIconSize, enableAnimation, showText, messengers)}
                        </div>
                    </div>
                    <div class="amb-home-indicator"></div>
                </div>
            </div>
        `;
    }

    // Render desktop preview
    function renderDesktopPreview(position, offset, primaryColor, hoverColor, iconSize, enableAnimation, showText, messengers) {
        const positionClass = 'amb-position-' + position;
        
        return `
            <div class="amb-desktop-mockup">
                <div class="amb-browser-window">
                    <div class="amb-browser-toolbar">
                        <div class="amb-browser-dots">
                            <span class="amb-dot red"></span>
                            <span class="amb-dot yellow"></span>
                            <span class="amb-dot green"></span>
                        </div>
                        <div class="amb-address-bar">
                            <span>https://your-website.com</span>
                        </div>
                    </div>
                    <div class="amb-browser-content">
                        <div class="amb-content-placeholder large"></div>
                        <div class="amb-content-placeholder"></div>
                        <div class="amb-content-placeholder short"></div>
                        <div class="amb-content-grid">
                            <div class="amb-content-card"></div>
                            <div class="amb-content-card"></div>
                            <div class="amb-content-card"></div>
                        </div>
                        ${renderWidget(positionClass, offset, primaryColor, hoverColor, iconSize, enableAnimation, showText, messengers)}
                    </div>
                </div>
            </div>
        `;
    }

    // Render widget
    function renderWidget(positionClass, offset, primaryColor, hoverColor, iconSize, enableAnimation, showText, messengers) {
        const getMessengerIcon = (type) => {
            const icons = {
                'whatsapp': '<svg viewBox="0 0 24 24" fill="white" style="width: 60%; height: 60%;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
                'telegram': '<svg viewBox="0 0 24 24" fill="white" style="width: 60%; height: 60%;"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
                'viber': '<svg viewBox="0 0 24 24" fill="white" style="width: 60%; height: 60%;"><path d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.633 9.817.57 12.933.488 18.774 6.12 20.36h.003l-.004 2.416s-.037.977.61 1.177c.777.242 1.234-.5 1.98-1.302.407-.44.972-1.084 1.397-1.58 3.851.322 6.812-.416 7.152-.525.776-.252 5.176-.816 5.892-6.657.74-6.02-.36-9.83-2.34-11.546-.596-.55-2.754-2.155-6.966-2.358-.146-.006-.278-.01-.398-.012zm.11 1.505c.094.002.21.005.344.01 3.617.16 5.304 1.5 5.86 2.003 1.624 1.504 2.52 4.074 1.866 9.5-.588 4.887-4.09 5.16-4.71 5.358-.283.09-2.88.737-6.137.508 0 0-2.428 2.947-3.19 3.712-.12.123-.26.175-.352.15-.13-.033-.167-.188-.165-.414l.02-4.018c-4.762-1.32-4.485-6.292-4.43-8.895.054-2.604.543-4.736 1.996-6.23C4.87 1.24 8.362 1.018 11.51 1.005z"/></svg>',
                'messenger': '<svg viewBox="0 0 24 24" fill="white" style="width: 60%; height: 60%;"><path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.11C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/></svg>',
                'signal': '<svg viewBox="0 0 24 24" fill="white" style="width: 60%; height: 60%;"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6" stroke="white" stroke-width="2" fill="none"/></svg>',
                'wechat': '<svg viewBox="0 0 24 24" fill="white" style="width: 60%; height: 60%;"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-5.523 3.397-6.95 1.128-.498 2.365-.748 3.57-.748.36 0 .717.027 1.074.08-.31-3.04-3.823-5.494-8.852-5.494z"/></svg>',
                'line': '<svg viewBox="0 0 24 24" fill="white" style="width: 60%; height: 60%;"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755z"/></svg>',
                'discord': '<svg viewBox="0 0 24 24" fill="white" style="width: 60%; height: 60%;"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 12.02 12.02 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>',
                'vk': '<svg viewBox="0 0 24 24" fill="white" style="width: 60%; height: 60%;"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0z"/></svg>',
                'max': '<svg viewBox="0 0 24 24" fill="white" style="width: 60%; height: 60%;"><text x="12" y="16" font-size="10" text-anchor="middle" fill="white" font-weight="bold">MAX</text></svg>'
            };
            return icons[type] || '';
        };
        
        const messengersHtml = messengers.map((m, index) => {
            return `
                <a href="#" class="amb-preview-messenger" style="animation-delay: ${index * 0.05}s;">
                    <div class="amb-preview-icon amb-preview-icon-${m.type}" style="width: ${iconSize}px; height: ${iconSize}px;">
                        ${m.customIcon ? `<img src="${m.customIcon}" alt="${m.name}">` : getMessengerIcon(m.type)}
                    </div>
                    ${showText ? `<span class="amb-preview-text">${m.name}</span>` : ''}
                </a>
            `;
        }).join('');
        
        return `
            <div class="amb-preview-widget ${positionClass}" style="--amb-offset: ${offset}px; --amb-icon-size: ${iconSize}px;">
                <div class="amb-preview-buttons">
                    ${messengersHtml}
                </div>
                <button class="amb-preview-toggle" style="width: ${iconSize}px; height: ${iconSize}px; background: linear-gradient(135deg, ${primaryColor}, ${hoverColor});">
                    <svg class="amb-icon-open" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <svg class="amb-icon-close" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <style>
                .amb-mobile-mockup {
                    width: 300px;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .amb-phone-frame {
                    width: 100%;
                    height: 680px;
                    background: #000;
                    border-radius: 48px;
                    padding: 8px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                    position: relative;
                    border: 3px solid #000;
                }
                .amb-phone-screen {
                    width: 100%;
                    height: 100%;
                    background: white;
                    border-radius: 40px;
                    overflow: hidden;
                    position: relative;
                }
                .amb-status-bar {
                    height: 48px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 32px;
                    font-size: 12px;
                    font-weight: 600;
                }
                .amb-status-icons {
                    display: flex;
                    gap: 4px;
                }
                .amb-battery {
                    width: 16px;
                    height: 12px;
                    border: 1px solid #374151;
                    border-radius: 2px;
                }
                .amb-page-content {
                    position: relative;
                    height: calc(100% - 48px);
                    overflow: visible;
                    padding: 20px;
                }
                .amb-content-placeholder {
                    height: 16px;
                    background: #e5e7eb;
                    border-radius: 8px;
                    margin-bottom: 12px;
                    pointer-events: none;
                }
                .amb-content-placeholder.short {
                    width: 70%;
                }
                .amb-content-placeholder.large {
                    height: 40px;
                    width: 50%;
                }
                .amb-content-image {
                    height: 128px;
                    background: linear-gradient(135deg, #dbeafe, #e9d5ff);
                    border-radius: 16px;
                    margin-top: 24px;
                    pointer-events: none;
                }
                .amb-home-indicator {
                    position: absolute;
                    bottom: 8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 128px;
                    height: 4px;
                    background: #4b5563;
                    border-radius: 2px;
                }
                .amb-desktop-mockup {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 32px;
                }
                .amb-browser-window {
                    width: 100%;
                    max-width: 1000px;
                    height: 700px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                }
                .amb-browser-toolbar {
                    height: 40px;
                    background: #f3f4f6;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    padding: 0 16px;
                    gap: 16px;
                }
                .amb-browser-dots {
                    display: flex;
                    gap: 8px;
                }
                .amb-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }
                .amb-dot.red { background: #ef4444; }
                .amb-dot.yellow { background: #f59e0b; }
                .amb-dot.green { background: #10b981; }
                .amb-address-bar {
                    flex: 1;
                    height: 24px;
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    padding: 0 12px;
                    font-size: 12px;
                    color: #6b7280;
                }
                .amb-browser-content {
                    height: calc(100% - 40px);
                    overflow: visible;
                    position: relative;
                    padding: 48px;
                }
                .amb-content-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                    margin-top: 32px;
                }
                .amb-content-card {
                    height: 192px;
                    background: linear-gradient(135deg, #dbeafe, #e9d5ff);
                    border-radius: 16px;
                    pointer-events: none;
                }
                .amb-preview-widget {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    z-index: 50;
                }
                .amb-preview-widget.amb-position-right-bottom {
                    bottom: var(--amb-offset);
                    right: var(--amb-offset);
                }
                .amb-preview-widget.amb-position-left-bottom {
                    bottom: var(--amb-offset);
                    left: var(--amb-offset);
                }
                .amb-preview-widget.amb-position-right-top {
                    top: var(--amb-offset);
                    right: var(--amb-offset);
                    flex-direction: column-reverse;
                }
                .amb-preview-widget.amb-position-left-top {
                    top: var(--amb-offset);
                    left: var(--amb-offset);
                    flex-direction: column-reverse;
                }
                .amb-preview-widget.amb-position-center-bottom {
                    bottom: var(--amb-offset);
                    left: 50%;
                    transform: translateX(-50%);
                }
                .amb-preview-buttons {
                    display: flex;
                    flex-direction: column-reverse;
                    gap: 8px;
                    opacity: 0;
                    visibility: hidden;
                    transform: scale(0.8);
                    transition: all 0.3s ease;
                }
                .amb-preview-widget.amb-position-right-top .amb-preview-buttons,
                .amb-preview-widget.amb-position-left-top .amb-preview-buttons {
                    flex-direction: column;
                }
                .amb-preview-widget.open .amb-preview-buttons {
                    opacity: 1;
                    visibility: visible;
                    transform: scale(1);
                }
                .amb-preview-messenger {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    text-decoration: none;
                    animation: slideUp 0.3s ease-out backwards;
                }
                .amb-preview-icon {
                    border-radius: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: none;
                    background: transparent;
                }
                .amb-preview-icon img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    border-radius: 0;
                }
                .amb-preview-icon svg {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
                .amb-preview-icon svg,
                .amb-preview-icon svg * {
                    fill: currentColor !important;
                    stroke: currentColor !important;
                }
                .amb-preview-icon-whatsapp { color: #25D366; }
                .amb-preview-icon-telegram { color: #229ED9; }
                .amb-preview-icon-viber { color: #7360F2; }
                .amb-preview-icon-messenger { color: #0084FF; }
                .amb-preview-icon-signal { color: #3A76F0; }
                .amb-preview-icon-wechat { color: #09B83E; }
                .amb-preview-icon-line { color: #00B900; }
                .amb-preview-icon-discord { color: #5865F2; }
                .amb-preview-icon-vk { color: #0077FF; }
                .amb-preview-icon-max { color: #6b7280; }
                .amb-preview-text {
                    font-size: 10px;
                    font-weight: 500;
                    color: #374151;
                }
                .amb-preview-toggle {
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
                    position: relative;
                    z-index: 60;
                }
                .amb-icon-open,
                .amb-icon-close {
                    width: 50%;
                    height: 50%;
                    position: absolute;
                    transition: all 0.3s ease;
                }
                .amb-icon-open {
                    opacity: 1;
                    transform: rotate(0deg) scale(1);
                }
                .amb-icon-close {
                    opacity: 0;
                    transform: rotate(90deg) scale(0);
                }
                .amb-preview-widget.open .amb-icon-open {
                    opacity: 0;
                    transform: rotate(-90deg) scale(0);
                }
                .amb-preview-widget.open .amb-icon-close {
                    opacity: 1;
                    transform: rotate(0deg) scale(1);
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>
        `;
    }

    // Initial preview render with delay to ensure DOM is ready
    setTimeout(function() {
        try {
            updatePreview();
        } catch (e) {
            // no-op
        }
    }, 100);
});
