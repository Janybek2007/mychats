export const formatTimestamp2 = timestamp => {
	if (!timestamp) {
		return
	}
	const date = timestamp.toDate()
	const options = {
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	}
	return date.toLocaleDateString('ru-RU', options)
}
