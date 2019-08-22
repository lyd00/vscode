import Vue from 'vue';
import main from './main.vue';
const vue = new Vue({
	el: '#app',
	components: {
		app: main
	}
})
console.log(main);
console.log(Vue);

