<script lang="ts">
	import { User, Settings, Lock, CircleCheck, Save } from 'lucide-svelte';
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

	// Form states
	let profileName = $state(user?.name ?? 'Usuario Demo');
	let profileEmail = $state(user?.email ?? 'user@example.com');
	let isSavingProfile = $state(false);
	let profileSaved = $state(false);

	let currentPassword = $state('');
	let newPassword = $state('');
	let isSavingPassword = $state(false);
	let passwordSaved = $state(false);

	let prefLanguage = $state('es');
	let prefCurrency = $state('EUR');
	let prefNotifications = $state(false);
	let isSavingPrefs = $state(false);
	let prefsSaved = $state(false);

	const handleSaveProfile = (e: Event) => {
		e.preventDefault();
		isSavingProfile = true;
		setTimeout(() => {
			isSavingProfile = false;
			profileSaved = true;
			setTimeout(() => (profileSaved = false), 3000);
		}, 800);
	};

	const handleSavePassword = (e: Event) => {
		e.preventDefault();
		isSavingPassword = true;
		setTimeout(() => {
			isSavingPassword = false;
			passwordSaved = true;
			currentPassword = '';
			newPassword = '';
			setTimeout(() => (passwordSaved = false), 3000);
		}, 800);
	};

	const handleSavePrefs = (e: Event) => {
		e.preventDefault();
		isSavingPrefs = true;
		setTimeout(() => {
			isSavingPrefs = false;
			prefsSaved = true;
			setTimeout(() => (prefsSaved = false), 3000);
		}, 800);
	};
</script>

<svelte:head>
	<title>LensLedger — Mi Perfil</title>
</svelte:head>

<main class="profile-page">
	<div class="profile-page__wrap">
		<header class="header">
			<p class="header__eyebrow">LensLedger</p>
			<h1 class="header__title">Mi Perfil</h1>
			<p class="header__sub">Visualiza y gestiona la información de tu cuenta y preferencias.</p>
		</header>

		<section class="profile-card">
			<div class="profile-card__avatar-section">
				<div class="profile-card__avatar">
					{userInitials}
				</div>
			</div>
			<div class="profile-card__info">
				<h2 class="profile-card__name">{profileName}</h2>
				<p class="profile-card__email">{profileEmail}</p>
				<span class="profile-card__badge">Cuenta Activa</span>
			</div>
		</section>

		<div class="details-section">
			<!-- Perfil -->
			<section class="details-card">
				<header class="details-card__header">
					<User size={20} class="details-card__icon" />
					<h2 class="details-card__title">Información Personal</h2>
				</header>
				<form class="details-form" onsubmit={handleSaveProfile}>
					<div class="form-group">
						<label class="form-group__label" for="profile-name">Nombre completo</label>
						<input id="profile-name" type="text" class="form-group__input" bind:value={profileName} required />
					</div>
					<div class="form-group">
						<label class="form-group__label" for="profile-email">Correo electrónico</label>
						<input id="profile-email" type="email" class="form-group__input" bind:value={profileEmail} required />
					</div>
					<div class="details-form__actions">
						{#if profileSaved}
							<span class="status-msg status-msg--success"><CircleCheck size={16} /> Guardado con éxito</span>
						{/if}
						<button type="submit" class="btn btn--primary" disabled={isSavingProfile}>
							{#if isSavingProfile} Guardando... {:else} <Save size={16} /> Guardar cambios {/if}
						</button>
					</div>
				</form>
			</section>

			<!-- Contraseña -->
			<section class="details-card">
				<header class="details-card__header">
					<Lock size={20} class="details-card__icon" />
					<h2 class="details-card__title">Seguridad</h2>
				</header>
				<form class="details-form" onsubmit={handleSavePassword}>
					<div class="form-group">
						<label class="form-group__label" for="current-password">Contraseña actual</label>
						<input id="current-password" type="password" class="form-group__input" bind:value={currentPassword} required />
					</div>
					<div class="form-group">
						<label class="form-group__label" for="new-password">Nueva contraseña</label>
						<input id="new-password" type="password" class="form-group__input" bind:value={newPassword} required />
					</div>
					<div class="details-form__actions">
						{#if passwordSaved}
							<span class="status-msg status-msg--success"><CircleCheck size={16} /> Contraseña actualizada</span>
						{/if}
						<button type="submit" class="btn btn--secondary" disabled={isSavingPassword || !currentPassword || !newPassword}>
							{#if isSavingPassword} Actualizando... {:else} <Lock size={16} /> Cambiar contraseña {/if}
						</button>
					</div>
				</form>
			</section>

			<!-- Preferencias -->
			<section class="details-card">
				<header class="details-card__header">
					<Settings size={20} class="details-card__icon" />
					<h2 class="details-card__title">Preferencias de la App</h2>
				</header>
				<form class="details-form" onsubmit={handleSavePrefs}>
					<div class="form-group form-group--inline">
						<label class="form-group__label" for="pref-lang">Idioma</label>
						<select id="pref-lang" class="form-group__select" bind:value={prefLanguage}>
							<option value="es">Español (ES)</option>
							<option value="en">English (US)</option>
						</select>
					</div>
					<div class="form-group form-group--inline">
						<label class="form-group__label" for="pref-curr">Moneda principal</label>
						<select id="pref-curr" class="form-group__select" bind:value={prefCurrency}>
							<option value="EUR">Euro (€)</option>
							<option value="USD">Dólar Estadounidense ($)</option>
							<option value="GBP">Libra Esterlina (£)</option>
						</select>
					</div>
					<div class="form-group form-group--toggle">
						<label class="form-group__label" for="pref-notif">Recibir notificaciones por correo</label>
						<input id="pref-notif" type="checkbox" bind:checked={prefNotifications} class="toggle-checkbox" />
					</div>
					<div class="details-form__actions">
						{#if prefsSaved}
							<span class="status-msg status-msg--success"><CircleCheck size={16} /> Preferencias guardadas</span>
						{/if}
						<button type="submit" class="btn btn--secondary" disabled={isSavingPrefs}>
							{#if isSavingPrefs} Guardando... {:else} <Save size={16} /> Guardar preferencias {/if}
						</button>
					</div>
				</form>
			</section>
		</div>
	</div>
</main>
