<script lang="ts">
	import { User, Settings, Lock, CircleCheck, Save, Crown } from 'lucide-svelte';
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
	<title>Facturator.ai — Mi Perfil</title>
</svelte:head>

<main class="profile-page">
	<div class="profile-page__wrap">
		<header class="header">
			<p class="header__eyebrow">Facturator.ai</p>
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
			<!-- Suscripción MVP -->
			<section class="details-card">
				<header class="details-card__header">
					<Crown size={20} class="details-card__icon" style="color: var(--color-warning);" />
					<h2 class="details-card__title">Mi Plan Actual</h2>
				</header>
				<div class="details-card__content" style="padding: 1.5rem; background: var(--bg-surface-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-light); margin-bottom: 1.5rem;">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
						<div>
							<h3 style="font-size: 1.25rem; font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
								Pro (MVP Early Access)
								<span style="font-size: 0.75rem; background: var(--color-success); color: white; padding: 2px 8px; border-radius: 12px;">Activo</span>
							</h3>
							<p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem;">
								¡Gracias por participar en el primer MVP de Facturator.ai!
							</p>
						</div>
						<div style="text-align: right;">
							<p style="font-size: 1.5rem; font-weight: 700; color: var(--text-main);">0,00 € <span style="font-size: 1rem; font-weight: 400; color: var(--text-muted);">/ mes</span></p>
						</div>
					</div>
					
					<div style="background: rgba(var(--color-primary-rgb), 0.05); padding: 1rem; border-radius: var(--radius-sm); border: 1px dashed var(--color-primary);">
						<h4 style="font-size: 0.875rem; font-weight: 600; color: var(--color-primary); margin-bottom: 0.5rem;">Beneficios incluidos en tu cuenta:</h4>
						<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
							<li style="font-size: 0.875rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem;">
								<CircleCheck size={14} style="color: var(--color-success);" />
								Límite de subidas <strong>ilimitado</strong> para facturas.
							</li>
							<li style="font-size: 0.875rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem;">
								<CircleCheck size={14} style="color: var(--color-success);" />
								Extracción de datos con IA Premium.
							</li>
							<li style="font-size: 0.875rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem;">
								<CircleCheck size={14} style="color: var(--color-success);" />
								Sin coste durante la fase Beta / MVP.
							</li>
						</ul>
					</div>
				</div>
			</section>

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
