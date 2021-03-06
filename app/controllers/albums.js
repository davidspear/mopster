import Ember from "ember";

export default Ember.Controller.extend({
  sort: function () {
    // TODO: simplify somehow
    const sortableFunction = function (a, b) {
      const date = b.date - a.date;
      if (date === 0) {
        if (a.album.name === b.album.name) {
          return a.track_no - b.track_no;
        }
        return a.album.name > b.album.name ? 1 : -1;
      }
      return date;
    };

    let groupedModel = this.get("model").reduce(function (grouped, item) {
      if (grouped[item.album.name]) {
        grouped[item.album.name].push(item);
      } else {
        grouped[item.album.name] = [item];
      }
      return grouped;
    }, {});

    groupedModel = Object.keys(groupedModel).reduce(function (sorted, key) {
      sorted.push(groupedModel[key].sort(sortableFunction));
      return sorted;
    }, []);

    this.set("albums", groupedModel.reverse());
  }.observes("model"),

  actions: {
    add: function (uri) {
      this.get("mop").addUris([uri]).then(() => {
        this.transitionToRoute("queue");
      });
    },
  },
});
