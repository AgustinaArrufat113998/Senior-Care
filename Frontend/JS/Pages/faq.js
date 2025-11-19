document.addEventListener("DOMContentLoaded", () => {
  const accordionElement = document.getElementById("faqAccordion");
  const faqItems = accordionElement ? Array.from(accordionElement.querySelectorAll("[data-faq-item]")) : [];
  const searchInput = document.getElementById("faqSearch");
  const toggleAllBtn = document.getElementById("faqToggleAll");
  const resultsLabel = document.getElementById("faqResults");
  const chipGroup = document.getElementById("faqChipGroup");
  let activeCategory = "all";
  let searchQuery = "";
  let toggleState = "collapsed";
  let searchTimeout;

  const normalize = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const applyFilters = () => {
    let visible = 0;
    faqItems.forEach((item) => {
      const categories = (item.dataset.categories || "").split(" ");
      const question = normalize(item.dataset.question || "");
      const matchesCategory = activeCategory === "all" || categories.includes(activeCategory);
      const matchesSearch = !searchQuery || question.includes(searchQuery);
      const shouldHide = !(matchesCategory && matchesSearch);
      item.classList.toggle("d-none", shouldHide);
      if (!shouldHide) visible += 1;
    });
    if (resultsLabel) {
      const prefix = visible === 0 ? "Sin resultados" : `${visible.toString().padStart(2, "0")} respuestas`;
      const suffix = searchQuery ? " para tu búsqueda" : " disponibles";
      resultsLabel.textContent = `${prefix}${suffix}`;
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.trim();
    searchQuery = normalize(value);
    applyFilters();
  };

  const debouncedSearch = (event) => {
    window.clearTimeout(searchTimeout);
    searchTimeout = window.setTimeout(() => handleSearch(event), 180);
  };

  const handleChipClick = (event) => {
    const chip = event.target.closest("[data-faq-chip]");
    if (!chip) return;
    activeCategory = chip.dataset.faqChip;
    chipGroup.querySelectorAll(".faq-chip").forEach((element) => element.classList.remove("active"));
    chip.classList.add("active");
    applyFilters();
  };

  const toggleAll = () => {
    if (!accordionElement) return;
    const expand = toggleState === "collapsed";
    faqItems.forEach((item) => {
      if (item.classList.contains("d-none")) return;
      const collapseId = item.querySelector(".accordion-collapse")?.id;
      if (!collapseId) return;
      const el = document.getElementById(collapseId);
      if (!el) return;
      const instance = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });
      if (expand) {
        instance.show();
      } else {
        instance.hide();
      }
    });
    toggleState = expand ? "expanded" : "collapsed";
    toggleAllBtn.textContent = expand ? "Contraer todas" : "Expandir todas";
  };

  searchInput?.addEventListener("input", debouncedSearch);
  chipGroup?.addEventListener("click", handleChipClick);
  toggleAllBtn?.addEventListener("click", toggleAll);
  applyFilters();
});
