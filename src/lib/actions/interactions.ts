import gsap from 'gsap';

export function magnetic(node: HTMLElement, { power = 0.4 } = {}) {
	let boundingRect: DOMRect;
	let mouseMoveHandler: (e: MouseEvent) => void;
	let mouseLeaveHandler: () => void;
	let mouseEnterHandler: () => void;

	const init = () => {
		mouseEnterHandler = () => {
			boundingRect = node.getBoundingClientRect();
		};

		mouseMoveHandler = (e: MouseEvent) => {
			const x = e.clientX - boundingRect.left - boundingRect.width / 2;
			const y = e.clientY - boundingRect.top - boundingRect.height / 2;

			gsap.to(node, {
				x: x * power,
				y: y * power,
				duration: 0.6,
				ease: 'power3.out'
			});
		};

		mouseLeaveHandler = () => {
			gsap.to(node, {
				x: 0,
				y: 0,
				duration: 0.8,
				ease: 'elastic.out(1, 0.3)'
			});
		};

		node.addEventListener('mouseenter', mouseEnterHandler);
		node.addEventListener('mousemove', mouseMoveHandler);
		node.addEventListener('mouseleave', mouseLeaveHandler);
	};

	init();

	return {
		update(newOptions: { power?: number }) {
			power = newOptions.power ?? 0.4;
		},
		destroy() {
			node.removeEventListener('mouseenter', mouseEnterHandler);
			node.removeEventListener('mousemove', mouseMoveHandler);
			node.removeEventListener('mouseleave', mouseLeaveHandler);
		}
	};
}

export function glowTracking(node: HTMLElement) {
	let mouseMoveHandler: (e: MouseEvent) => void;

	const init = () => {
		mouseMoveHandler = (e: MouseEvent) => {
			const rect = node.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			node.style.setProperty('--mouse-x', `${x}px`);
			node.style.setProperty('--mouse-y', `${y}px`);
		};

		node.addEventListener('mousemove', mouseMoveHandler);
	};

	init();

	return {
		destroy() {
			node.removeEventListener('mousemove', mouseMoveHandler);
		}
	};
}

export function tilt(node: HTMLElement, { intensity = 10 } = {}) {
	let mouseMoveHandler: (e: MouseEvent) => void;
	let mouseLeaveHandler: () => void;

	const init = () => {
		mouseMoveHandler = (e: MouseEvent) => {
			const rect = node.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const xCenter = rect.width / 2;
			const yCenter = rect.height / 2;

			const rotateX = ((y - yCenter) / yCenter) * -intensity;
			const rotateY = ((x - xCenter) / xCenter) * intensity;

			gsap.to(node, {
				rotateX,
				rotateY,
				transformPerspective: 1000,
				duration: 0.5,
				ease: 'power2.out'
			});
		};

		mouseLeaveHandler = () => {
			gsap.to(node, {
				rotateX: 0,
				rotateY: 0,
				duration: 0.8,
				ease: 'elastic.out(1, 0.4)'
			});
		};

		node.addEventListener('mousemove', mouseMoveHandler);
		node.addEventListener('mouseleave', mouseLeaveHandler);
	};

	init();

	return {
		update(newOptions: { intensity?: number }) {
			intensity = newOptions.intensity ?? 10;
		},
		destroy() {
			node.removeEventListener('mousemove', mouseMoveHandler);
			node.removeEventListener('mouseleave', mouseLeaveHandler);
		}
	};
}
