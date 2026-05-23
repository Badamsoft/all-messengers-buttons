jQuery(document).ready(function($) {
    'use strict';

    const $widget = $('.bmb-messengers-widget');
    
    if (!$widget.length) {
        return;
    }

    const $toggleBtn = $widget.find('.bmb-toggle-btn');
    const $messengerBtns = $widget.find('.bmb-messenger-btn');

    // Working hours enforcement (client-side, browser local time)
    const workingHoursEnabled = $widget.data('working-hours-enabled') === true || $widget.data('working-hours-enabled') === 'true';
    const workingHoursScheduleRaw = $widget.data('working-hours-schedule');

    if (workingHoursEnabled && workingHoursScheduleRaw) {
        try {
            const schedule = typeof workingHoursScheduleRaw === 'string' ? JSON.parse(workingHoursScheduleRaw) : workingHoursScheduleRaw;
            const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
            const now = new Date();
            const dayKey = days[now.getDay()];
            const dayConfig = schedule && schedule[dayKey];

            const toMinutes = (timeStr) => {
                if (!timeStr || typeof timeStr !== 'string') return null;
                const parts = timeStr.split(':');
                if (parts.length < 2) return null;
                const h = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10);
                if (Number.isNaN(h) || Number.isNaN(m)) return null;
                return h * 60 + m;
            };

            const isOpenNow = () => {
                if (!dayConfig || dayConfig.enabled === false) return false;
                const start = toMinutes(dayConfig.startTime);
                const end = toMinutes(dayConfig.endTime);
                if (start === null || end === null) return true; // If time is not configured, consider it open
                const current = now.getHours() * 60 + now.getMinutes();
                return current >= start && current <= end;
            };

            if (!isOpenNow()) {
                $widget.remove();
                return;
            }
        } catch (err) {
            // If parsing fails, do not block the widget
            console.error('AMB working hours parse error', err);
        }
    }

    // Toggle widget open/close
    $toggleBtn.on('click', function(e) {
        e.preventDefault();
        $widget.toggleClass('open');
    });

    // Close widget when clicking outside
    $(document).on('click', function(e) {
        if (!$widget.is(e.target) && $widget.has(e.target).length === 0) {
            $widget.removeClass('open');
        }
    });

    // Track clicks with analytics
    $messengerBtns.on('click', function(e) {
        const messengerType = $(this).data('messenger');
        
        // Track with Google Analytics if available
        if (typeof bmbSettings !== 'undefined' && bmbSettings.enableAnalytics) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': bmbSettings.eventCategory || 'Messengers',
                    'event_label': messengerType
                });
            } else if (typeof ga !== 'undefined') {
                ga('send', 'event', bmbSettings.eventCategory || 'Messengers', 'click', messengerType);
            } else if (typeof _paq !== 'undefined') {
                // Matomo tracking
                _paq.push(['trackEvent', bmbSettings.eventCategory || 'Messengers', 'click', messengerType]);
            }
        }
    });

    // Add hover effects
    $messengerBtns.on('mouseenter', function() {
        $(this).find('.bmb-btn-icon').css('transform', 'scale(1.1)');
    }).on('mouseleave', function() {
        $(this).find('.bmb-btn-icon').css('transform', 'scale(1)');
    });

    // Keyboard accessibility
    $toggleBtn.on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });

    $messengerBtns.on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.open($(this).attr('href'), '_blank');
        }
    });

    // Add tabindex for accessibility
    $toggleBtn.attr('tabindex', '0');
    $messengerBtns.attr('tabindex', '0');
});
