let sidebarExpanded = $state(false);
let sidebarMobileOpen = $state(false);

let articleSidebarExpanded = $state(true);
let articleSidebarMobileOpen = $state(false);

export const ui = {
	get sidebarExpanded() {
		return sidebarExpanded;
	},
	get sidebarMobileOpen() {
		return sidebarMobileOpen;
	},
	toggleSidebar() {
		sidebarExpanded = !sidebarExpanded;
	},
	setSidebar(value: boolean) {
		sidebarExpanded = value;
	},
	closeSidebar() {
		sidebarExpanded = false;
	},
	openSidebar() {
		sidebarExpanded = true;
	},
	openMobileSidebar() {
		sidebarMobileOpen = true;
	},
	closeMobileSidebar() {
		sidebarMobileOpen = false;
	},
	toggleMobileSidebar() {
		sidebarMobileOpen = !sidebarMobileOpen;
	},

	// Article Sidebar
	get articleSidebarExpanded() {
		return articleSidebarExpanded;
	},
	get articleSidebarMobileOpen() {
		return articleSidebarMobileOpen;
	},
	toggleArticleSidebar() {
		articleSidebarExpanded = !articleSidebarExpanded;
	},
	setArticleSidebar(value: boolean) {
		articleSidebarExpanded = value;
	},
	closeArticleSidebar() {
		articleSidebarExpanded = false;
	},
	openArticleSidebar() {
		articleSidebarExpanded = true;
	},
	openArticleSidebarMobile() {
		articleSidebarMobileOpen = true;
	},
	closeArticleSidebarMobile() {
		articleSidebarMobileOpen = false;
	},
	toggleArticleSidebarMobile() {
		articleSidebarMobileOpen = !articleSidebarMobileOpen;
	}
};
