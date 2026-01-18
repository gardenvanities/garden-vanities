	let sidebarVisible = $state(true);

	export const ui = {
		get sidebarVisible() {
			return sidebarVisible;
		},
		toggleSidebar() {
			sidebarVisible = !sidebarVisible;
		},
		setSidebar(value: boolean) {
			sidebarVisible = value;
		},
		closeSidebar() {
			sidebarVisible = false;
		},
		openSidebar() {
			sidebarVisible = true;
		}
	};

