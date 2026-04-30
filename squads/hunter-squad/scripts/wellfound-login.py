"""
wellfound-login.py — Login único para Wellfound

Abre o browser em modo VISÍVEL para você fazer login manualmente no Wellfound.
Após o login, os cookies e sessão ficam salvos em:
  _opensquad/_browser_profile/wellfound/

O scraper usa esse perfil automaticamente nos próximos runs (headless=True).

USO:
  python squads/hunter-squad/scripts/wellfound-login.py

QUANDO RODAR:
  - Primeira vez (perfil ainda não existe)
  - Se o Wellfound deslogar sua sessão (normalmente a cada 30-90 dias)
  - Se começar a dar erro de login novamente no scraper
"""

import asyncio
import os
from pathlib import Path

from playwright.async_api import async_playwright

BASE_DIR = Path(__file__).resolve().parents[3]  # raiz do projeto Squad/
PROFILE_DIR = BASE_DIR / "_opensquad" / "_browser_profile" / "wellfound"
WELLFOUND_URL = "https://wellfound.com/login"


async def main():
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("  Wellfound — Login Persistente")
    print("=" * 60)
    print(f"\nPerfil: {PROFILE_DIR}")
    print("\nAbrindo browser... faça login e depois feche o browser.")
    print("(Aguarde as vagas aparecerem antes de fechar)\n")

    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            user_data_dir=str(PROFILE_DIR),
            headless=False,
            viewport={"width": 1280, "height": 800},
            args=["--disable-blink-features=AutomationControlled"],
        )

        page = context.pages[0] if context.pages else await context.new_page()
        await page.goto(WELLFOUND_URL, wait_until="domcontentloaded", timeout=30000)

        print("Browser aberto em:", page.url)
        print("Aguardando você fechar o browser após o login...")

        # Aguarda todas as páginas serem fechadas (usuário fecha o browser)
        while True:
            await asyncio.sleep(2)
            try:
                pages = context.pages
                if not pages:
                    break
            except Exception:
                break

        try:
            await context.close()
        except Exception:
            pass

    print("\n✅ Sessão salva com sucesso!")
    print(f"   Perfil: {PROFILE_DIR}")
    print("\nO scraper vai usar essa sessão automaticamente nos próximos runs.")
    print("Se o Wellfound deslogar, rode esse script novamente.\n")


if __name__ == "__main__":
    asyncio.run(main())
