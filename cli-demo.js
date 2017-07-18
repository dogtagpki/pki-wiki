/**
 * CLI Demo
 * http://edewata.fedorapeople.org/cli-demo/
 *
 * @author Endi S. Dewata <edewata@redhat.com>
 */

(function($) {

    var cli_demo = function() {

        var $this = $(this);

        var interval = 2000;
        var speed = 80;
        var running = false;
        var current = null;

        $this.init = function() {

            var text = $this.text();
            var list = $this.contents().detach();

            $this.console = $('<div/>', {
                'class': 'cli-demo-console'
            }).appendTo($this);

            $this.content = $('<span/>', {
                'class': 'cli-demo-content'
            }).appendTo($this.console);

            $this.elements = $('<span/>', {
                'class': 'cli-demo-hidden'
            }).hide().appendTo($this.console);

            $this.caret = $('<span/>', {
                'text': ' ',
                'class': 'cli-demo-caret'
            }).appendTo($this.console);

            $this.control = $('<div/>', {
                'class': 'cli-demo-control'
            }).appendTo($this);

            $this.playButton = $('<button/>', {
                'html': 'Play',
                'class': 'cli-demo-button',
                'click': function() { $this.play(); }
            }).appendTo($this.control);

            $this.playButton = $('<button/>', {
                'html': 'Stop',
                'class': 'cli-demo-button',
                'click': function() { $this.stop(); }
            }).appendTo($this.control);

            $this.prevButton = $('<button/>', {
                'html': 'Prev',
                'class': 'cli-demo-button',
                'click': function() { $this.prev(); }
            }).appendTo($this.control);

            $this.nextButton = $('<button/>', {
                'html': 'Next',
                'class': 'cli-demo-button',
                'click': function() { $this.next(); }
            }).appendTo($this.control);

            $this.resetButton = $('<button/>', {
                'html': 'Reset',
                'class': 'cli-demo-button',
                'click': function() { $this.reset(); }
            }).appendTo($this.control);

            if ($this.is('pre')) {
                $this.content.html(text);
            } else {
                $this.content.append(list);
            }

            $this.flush(function() {
                $this.console.scrollTop(0);
            });
        };

        $this.flush = function(done) {
            var run = function() {
                if ($this.elements.contents().length == 0) {
                    if (done) done.call();
                    return;
                }

                var element = $this.elements.contents().first();
                if (!element.hasClass('cli-demo-input')) {
                    $this.next(run);
                    return;
                }

                done.call();
            };

            run.call();
        };

        $this.play = function() {

            running = true;

            var run = function() {
                if (!running) return;
                if ($this.elements.contents().length == 0) return;

                $this.next(function() {
                    if (running) setTimeout(run, interval);
                });
            };

            run.call();
        };

        $this.stop = function() {
            running = false;
        };

        $this.prev = function() {
            if ($this.content.contents().length == 0) return;

            var element = $this.content.contents().last().detach();
            $this.elements.prepend(element);

            var text = element.text();
            if (element.hasClass('cli-demo-input') && text.length > 0) return;

            if ($this.content.contents().length > 0) {
                element = $this.content.contents().last();
                if (element.hasClass('cli-demo-input')) return;
                element.detach();
                $this.elements.prepend(element);
            }

            $this.flush(function() {
                var height = $this.content.height();
                $this.console.scrollTop(height);
            });

        };

        $this.next = function(callback) {
            if ($this.animator || $this.elements.contents().length == 0) {
                return;
            }

            current = $this.elements.contents().first().detach();

            if (current.hasClass('cli-demo-input')) {
                var text = current.text();
                if (text.length == 0) {
                    $this.content.append(current);
                    $this.next(callback);

                } else {
                    current.text('');
                    var i = 0;

                    $this.content.append(current);
                    $this.animator = setInterval(function() {
                        if (i <= text.length) {
                            current.text(text.substring(0, i));
                            i++;
                        } else {
                            clearInterval($this.animator);
                            delete $this.animator;
                            if (callback) callback.call();
                        }
                    }, speed);
                }

            } else {
                $this.content.append(current);
                $this.flush(function() {
                    var height = $this.content.height();
                    $this.console.scrollTop(height);
                });
                if (callback) callback.call();
            }
        };

        $this.reset = function() {

            $this.stop();

            var elements = $this.content.contents().detach()
            $this.elements.prepend(elements);

            $this.flush(function() {
                var height = $this.content.height();
                $this.console.scrollTop(height);
            });
        };

        $this.init();

        return $this;
    };

    $.fn.cli_demo = function() {
        return this.each(cli_demo);
    };

}(jQuery));
