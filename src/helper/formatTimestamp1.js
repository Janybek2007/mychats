export const formatTimestamp = timestamp => {
	if (!timestamp) {
		return
	}
	const messageDate = timestamp?.toDate()
	const currentDate = new Date()

	if (
		messageDate.getDate() === currentDate.getDate() &&
		messageDate.getMonth() === currentDate.getMonth() &&
		messageDate.getFullYear() === currentDate.getFullYear()
	) {
		const options = { hour: 'numeric', minute: 'numeric' }
		return messageDate.toLocaleTimeString('ru-RU', options)
	} else {
		const options = {
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		}
		return messageDate.toLocaleDateString('ru-RU', options)
	}
}
