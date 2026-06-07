<script lang="ts">
	import '$lib/styles/profile.scss';

	let { data } = $props();

	const user = $derived(data?.user);
	const userInitials = $derived.by(() => {
		if (!user?.name) return 'US';
		return user.name
			.split(' ')
			.map((n: string) => n[0])
			.join('')
			.substring(0, 2)
			.toUpperCase();
	});
</script>

<svelte:head>
	<title>LensLedger — Mi Perfil</title>
</svelte:head>

<main class="profile-page">
	<div class="profile-page__wrap">
		<header class="header">
			<p class="header__eyebrow">LensLedger</p>
			<h1 class="header__title">Mi Perfil</h1>
			<p class="header__sub">Visualiza y gestiona la información de tu cuenta.</p>
		</header>

		<section class="profile-card">
			<div class="profile-card__avatar-section">
				<div class="profile-card__avatar">
					{userInitials}
				</div>
			</div>
			<div class="profile-card__info">
				<h2 class="profile-card__name">{user?.name ?? 'Usuario Demo'}</h2>
				<p class="profile-card__email">{user?.email ?? 'user@example.com'}</p>
				<span class="profile-card__badge">Cuenta Demo Activa</span>
			</div>
		</section>

		<div class="details-section">
			<section class="details-card">
				<h2 class="details-card__title">Información de Cuenta</h2>
				<div class="details-card__list">
					<div class="details-card__item">
						<span class="details-card__label">Identificador</span>
						<span class="details-card__value">usr_mock_92a3f8c1</span>
					</div>
					<div class="details-card__item">
						<span class="details-card__label">Rol</span>
						<span class="details-card__value">Administrador</span>
					</div>
					<div class="details-card__item">
						<span class="details-card__label">Proveedor</span>
						<span class="details-card__value">mejor-auth (Mock)</span>
					</div>
					<div class="details-card__item">
						<span class="details-card__label">Miembro desde</span>
						<span class="details-card__value">Mayo 2026</span>
					</div>
				</div>
			</section>

			<section class="details-card">
				<h2 class="details-card__title">Preferencias de la App</h2>
				<div class="details-card__list">
					<div class="details-card__item">
						<span class="details-card__label">Idioma</span>
						<span class="details-card__value">Español (ES)</span>
					</div>
					<div class="details-card__item">
						<span class="details-card__label">Tema</span>
						<span class="details-card__value">Premium Dark Mode</span>
					</div>
					<div class="details-card__item">
						<span class="details-card__label">Moneda principal</span>
						<span class="details-card__value">EUR (€)</span>
					</div>
					<div class="details-card__item">
						<span class="details-card__label">Notificaciones</span>
						<span class="details-card__value">Desactivadas</span>
					</div>
				</div>
			</section>
		</div>
	</div>
</main>
