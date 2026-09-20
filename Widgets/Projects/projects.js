// ============================================================================
// projects.js — the Projects grid's own data + "Load More" pagination.
// ============================================================================

import { createPaginatedGrid, buildProjectCard } from '../core.js';

const projects = [
    { title: 'LKDA - Strategic Creative Advertising', img: 'Lkda.png', url: 'https://www.lkda.co.za/', tags: ['Laravel', 'Umbraco', 'CMS'], descEn: 'Creative advertising agency website', descAf: 'Kreatiewe advertensie-agentskap webwerf' },
    { title: 'ATP', img: 'ATPsite.png', url: 'https://amplifytradepartners.co.za/', tags: ['WordPress', 'PHP', 'SEO'], descEn: 'Amplify Trade Partners website', descAf: 'Amplify Trade Partners webwerf' },
    { title: '3D Lazer Monkey', img: '3D%20lasermonkey.png', url: 'https://3dlasermonkey.co.za/', tags: ['WordPress', '3D'], descEn: '3D printing and laser cutting services', descAf: '3D-druk en lasersnydienste' },
    { title: 'Nissan SA', img: 'NissanSA.png', url: 'https://www.nissan.co.za/', tags: ['WordPress', 'PHP', 'SEO'], descEn: 'Official Nissan South Africa website', descAf: 'Amptelike Nissan Suid-Afrika webwerf' },
    { title: 'Nissan Angola', img: 'NissanAngola.png', url: 'https://www.nissan.co.ao/', tags: ['WordPress', 'PHP'], descEn: 'Official Nissan Angola website', descAf: 'Amptelike Nissan Angola webwerf' },
    { title: 'Nissan Uganda', img: 'NissanUganda.png', url: 'https://www.nissan.co.ug/', tags: ['WordPress', 'PHP'], descEn: 'Official Nissan Uganda website', descAf: 'Amptelike Nissan Uganda webwerf' },
    { title: 'Afrit', img: 'afrit.png', url: 'https://afrit.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Trailer manufacturing company website', descAf: 'Sleepwa-vervaardigingsmaatskappy webwerf' },
    { title: 'Safal Steel', img: 'Safalsteel.png', url: 'https://www.safalsteel.com/', tags: ['WordPress', 'PHP'], descEn: 'Steel manufacturing company website', descAf: 'Staalvervaardigingsmaatskappy webwerf' },
    { title: 'Mega Master SA', img: 'Megamaster.png', url: 'https://megamaster.co.za/', tags: ['WordPress', 'E-commerce'], descEn: 'BBQ and outdoor products e-commerce', descAf: 'Braai en buite-produkte e-handel' },
    { title: 'First 4 Men', img: 'First4Men.png', url: 'https://first4men.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Men\'s health and wellness website', descAf: 'Mans gesondheid en welstand webwerf' },
    { title: 'Gridcontrol', img: 'Gridcontroll.png', url: 'https://www.gridcontrol.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Power solutions company website', descAf: 'Kragoplossings maatskappy webwerf' },
    { title: 'Blueasset group', img: 'Blueasset.png', url: 'https://blueassetgroup.com/za', tags: ['WordPress', 'PHP'], descEn: 'Asset management company website', descAf: 'Batebestuur maatskappy webwerf' },
    { title: 'Pinaroch', img: 'Pinaroch.png', url: 'https://pinaroch.co.za/', tags: ['Laravel', 'PHP', 'Middleware'], descEn: 'Construction company website', descAf: 'Konstruksiemaatskappy webwerf' },
    { title: 'MyBuildings Africa', img: 'My%20buildings%20africa.png', url: 'https://mybuildingsafrica.com/', tags: ['Laravel', 'CMS'], descEn: 'Property management platform', descAf: 'Eiendomsbestuur platform' },
    { title: 'myBuildings EMEA', img: 'My%20buildings%20emea.png', url: 'https://mybuildingsemea.com/', tags: ['Laravel', 'CMS'], descEn: 'Property management platform EMEA', descAf: 'Eiendomsbestuur platform EMEA' },
    { title: 'Chery', img: 'cherry%20South%20africa.png', url: 'https://www.chery.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Official Chery South Africa website', descAf: 'Amptelike Chery Suid-Afrika webwerf' },
    { title: 'Goscor', img: 'Goscor%20group.png', url: 'https://goscor.co.za/', tags: ['WordPress', 'Multi-site'], descEn: 'Industrial equipment group website', descAf: 'Industriële toerusting groep webwerf' },
    { title: 'Goscor Earth Moving', img: 'Goscor%20earth%20moving.png', url: 'https://www.goscorearthmoving.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Earth moving equipment website', descAf: 'Grondverskuiwingstoerusting webwerf' },
    { title: 'Goscor Lift Trucks', img: 'Goscor%20lift%20trucks.png', url: 'https://goscorlifttrucks.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Forklift solutions website', descAf: 'Vurkhyser oplossings webwerf' },
    { title: 'Goscor Compressed Air', img: 'Goscor%20compressed%20air.png', url: 'https://www.goscorcompressedair.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Compressed air solutions website', descAf: 'Saamgeperste lug oplossings webwerf' },
    { title: 'Goscor Cleaning', img: 'Goscor%20cleaning.png', url: 'https://goscorcleaning.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Industrial cleaning equipment website', descAf: 'Industriële skoonmaaktoerusting webwerf' },
    { title: 'CTU Training', img: 'CTU%20training.png', url: 'https://ctutraining.ac.za/', tags: ['WordPress', 'Education'], descEn: 'IT training institution website', descAf: 'IT-opleidingsinstelling webwerf' },
    { title: 'HEX', img: 'Hex.png', url: 'https://hexintegratedsolutions.com/', tags: ['WordPress', 'PHP'], descEn: 'Integrated solutions company website', descAf: 'Geïntegreerde oplossings maatskappy webwerf' },
    { title: 'Real Box', img: 'Realbox.png', url: 'https://realbox.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Container solutions website', descAf: 'Houer oplossings webwerf' },
    { title: 'Commercial PV', img: 'CommercialPV.png', url: 'https://commercialpv.co.za/', tags: ['WordPress', 'Solar'], descEn: 'Commercial solar solutions website', descAf: 'Kommersiële sonkrag oplossings webwerf' },
    { title: 'Battery Distributors', img: 'batterydis.png', url: 'https://batterydistributors.co.za/', tags: ['WordPress', 'E-commerce'], descEn: 'Battery products e-commerce store', descAf: 'Battery produkte e-handel winkel' },
    { title: 'Rectifier', img: 'rectifier.png', url: 'https://rectifier.co.za/', tags: ['WordPress', 'PHP'], descEn: 'Power electronics company website', descAf: 'Krag-elektronika maatskappy webwerf' },
    { title: 'Go4Green', img: 'go4green.png', url: 'https://go4greenenergy.co.za/', tags: ['WordPress', 'Green Energy'], descEn: 'Green energy solutions website', descAf: 'Groen energie oplossings webwerf' },
    { title: 'Current Automation', img: 'Current%20automation.png', url: 'https://currentautomation.ca/', tags: ['WordPress', 'E-commerce'], descEn: 'Industrial automation e-commerce', descAf: 'Industriële outomatisering e-handel' },
    { title: "CA's Meanwell", img: 'CA%20meanwell.png', url: 'https://meanwell.co.za/', tags: ['WordPress', 'E-commerce'], descEn: 'Power supply products e-commerce', descAf: 'Kragtoevoer produkte e-handel' },
    { title: 'Solar-Solution', img: 'Solar%20solutions.png', url: 'https://solar-solution.co.za/', tags: ['WordPress', 'Solar'], descEn: 'Solar energy solutions website', descAf: 'Sonkrag oplossings webwerf' },
    { title: 'Victron Products', img: 'Victron.png', url: 'https://victronproducts.co.za/', tags: ['WordPress', 'E-commerce'], descEn: 'Victron energy products e-commerce', descAf: 'Victron energie produkte e-handel' }
];

export function initProjects() {
    createPaginatedGrid({
        gridId: 'projects-grid',
        buttonId: 'projects-load-more',
        items: projects,
        renderCard: buildProjectCard
    });
}
