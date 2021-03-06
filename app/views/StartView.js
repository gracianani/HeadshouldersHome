// StartView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Start.html", "animationscheduler", "views/RankView", "models/RankList","hammerjs"],
    function ($, Backbone, Mustache, template, AnimationScheduler, RankView, RankList, Hammer) {
        var StartView = Backbone.View.extend({

            el: "#main",
            
            initialize: function () {
                this.listenTo(this, "render", this.postRender);
                this.listenTo(this.model,"onFetchSuccess", this.ready);
                this.isReady = false;
            },
            
            events: {
                "touch #showTops":"onClickLeaderboard",
                "touch #backHome":"onClickBackHome",
                "touch .leaderboard-button":"onClickLeaderboardTab",
                "touch #plane":"onClickLotto",
                "swipedown #leaderboard":"onClickBackHome"
            },
            render: function () {
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));
                this.trigger("render");
                return this;
            },
            postRender: function() {
                this.$el.hammer();
                Hammer.plugins.fakeMultitouch();
                var self = this;
                this.lottoAnimationScheduler = new AnimationScheduler(this.$el.find("#belt,#plane"));
                this.btnAnimationScheduler = new AnimationScheduler(this.$el.find(".gameButton"), {"isSequential":true});
                
                this.lottoAnimationScheduler.animateIn(function(){
                    self.btnAnimationScheduler.animateIn();
                });
            },
            ready: function(){
                this.render();
                this.isReady = true;
            },
            onClickLeaderboard: function(e){
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 

                this.showLeaderboard();
                return false;
                
            },
            showLeaderboard: function( leaderboardName ){
            
                var tabId = "#leaderboard-buttonScore";
                if ( leaderboardName ) {
    
                    if ( leaderboardName == "dribble" ) {
                        tabId = "#leaderboard-buttonDribble";
                    } else if ( leaderboardName == "pass" ) {
                        tabId = "#leaderboard-buttonPass";
                    } else if ( leaderboardName == "shoot" ) {
                        tabId = "#leaderboard-buttonShoot";
                    }
                    
                }
                var self = this;
                this.$el.find("#leaderboard").addClass("expand");                
                this.ranklist = new RankList();
                this.ranklist.fetch({
                    success: function(){
                        self.rankView = new RankView({model:self.ranklist, user: self.model});
                        if ( tabId ) {
                            var e = {};
                            e.target = tabId;
                            self.onClickLeaderboardTab(e);
                        }
                    }
                });                
            },
            onClickBackHome: function(e){
                e.preventDefault();
                e.stopPropagation();
                e.gesture.preventDefault();
                e.gesture.stopPropagation(); 
                e.gesture.stopDetect();
                var self = this;
                $('body').animate({
                    scrollTop:0
                },500,
                function(){
                    self.$el.find("#leaderboard").removeClass("expand");
                    Backbone.history.navigate("", { trigger: false, replace: true });
                }
                );
                
                return false;
            },
            onClickLeaderboardTab: function(e) {
                
                var self = this;
                var tab = $(e.target);
                var type =tab.attr("data-type");
                var id = "#leaderboard-" + type;
                
                tab.siblings(".current").removeClass("current");
                tab.addClass("current");
                
                $(".leaderboard-content.current").removeClass("current");
                $(id).addClass("current animated fadeIn");
                
                Backbone.history.navigate("leaderboard/" + type, { trigger: false, replace: true });
            },
            onSwipeLeaderboard: function(e) {
                e.gesture.preventDefault();
                e.gesture.stopPropagation();
                console.log('here');
            },
            onClickLotto: function(e) {
                Backbone.history.navigate("lotto", { trigger: true, replace: true });

            },
            onExit: function(e) {
                
            }
        });
        return StartView;
    }

);