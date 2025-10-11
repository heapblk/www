const g_path_map = new Map();
g_path_map.set("/foundations/", "/foundations/index.html");
g_path_map.set("/systems/", "/systems/index.html");

async function loadPageHTML(url) {
	try {
		const response = await fetch(url);
		const htmlText = await response.text();

		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlText, 'text/html');

		// replace entire head content
		document.head.innerHTML = doc.head.innerHTML;

		// Replace body content
		document.body.innerHTML = doc.body.innerHTML;
	} catch (err) {
		console.error('Failed to load HTML:', err);
	}
}

function handleRouting() {
	if(g_path_map.has(location.pathname)){
		loadPageHTML(g_path_map.get(location.pathname));
	}else if( location.pathname === "/"){
		loadPageHTML("index.html");
	}else{
		console.error("requested path: "+location.pathname+" does not exist");
	}
}

// On load
window.addEventListener('DOMContentLoaded', handleRouting);

// On navigation
window.addEventListener('popstate', handleRouting);

// Handle internal <a> clicks
document.addEventListener('click', (e) => {
	if (e.target.matches('a')) {
		const href = e.target.getAttribute('href');
		if (href.startsWith('/')) {
			e.preventDefault();
			history.pushState({}, '', href);
			handleRouting();
		}
	}
});
