export default function convertToMinutes(ms) {
	var minutes = Math.floor(ms / (1000 * 60));
	var seconds = ((ms % (1000 * 60)) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
