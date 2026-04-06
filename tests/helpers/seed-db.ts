import { createDatabase, type Database } from '../../src/db.js';

export function createSeededDatabase(dbPath: string): Database {
  const db = createDatabase(dbPath);

  // --- Hegn (Hedgerow) Rules ---
  // Source: Lov om hegn (LBK nr 851 af 17/08/2011); Naturbeskyttelsesloven §3
  const hedgerowData: [string, number, string | null, string | null, string | null, string | null, string][] = [
    [
      'Fjernelse af levende hegn mod nabo (hegnspligt)',
      1,
      'Hegnspligten bortfalder, hvis begge naboer er enige om, at hegnet ikke er nødvendigt. Tekniske undtagelser: hegn kan fjernes midlertidigt ved byggearbejde med naboens accept.',
      'Levende hegn langs ejendomsgrænserne er reguleret af Hegnsloven. Fjernelse kræver som udgangspunkt naboens samtykke. Hegnssyn kan pålægge genoprettelse hvis hegnet er fjernet ulovligt.',
      'Erstatningspligt over for nabo. Hegnssyn kan pålægge genplantning for ejerens regning. Bøde ved overtrædelse af påbud.',
      'Lov om hegn §1, §9, §28',
      'DK',
    ],
    [
      'Klipning og vedligeholdelse af levende hegn',
      0,
      'Klipning er tilladt hele året, men god landbrugsskik anbefaler at undgå fuglenes ynglesæson (15. marts til 15. august). Visse kommuner har lokale restriktioner.',
      null,
      'Ingen bøde for klipning i ynglesæsonen i sig selv, men Naturbeskyttelsesloven §29 beskytter fugle og reder. Gødnings- og pesticidbegrænsninger gælder inden for randzoner.',
      'Naturbeskyttelsesloven §29; God landbrugspraksis',
      'DK',
    ],
    [
      'Hegn og indgreb i §3-beskyttede naturtyper',
      1,
      'Dispensation kan søges hos kommunen i særlige tilfælde. Dispensation gives sjældent til permanente anlæg i beskyttede naturtyper.',
      'Hegn eller andre indgreb i §3-beskyttede naturtyper (ferske enge, moser, heder, overdrev, strandenge, søer) kræver dispensation fra kommunen. Beskyttelsen er absolut med begrænsede undtagelser.',
      'Overtrædelse af §3-beskyttelse: bøde op til 10.000 DKK og påbud om retablering for ejerens regning. Kommunen kan anlægge sag efter Miljøbeskyttelsesloven.',
      'Naturbeskyttelsesloven §3, §65, §66',
      'DK',
    ],
    [
      'Hegn langs skov (skovbyggelinje)',
      0,
      'Byggeri og anlæg inden for skovbyggelinjen kræver landzonetilladelse eller dispensation. Hegn til afgræsning anses normalt ikke som byggeri, men faste konstruktioner kan kræve tilladelse.',
      null,
      null,
      'Naturbeskyttelsesloven §17 (skovbyggelinje 300m); Planloven',
      'DK',
    ],
    [
      'Hegn i strandbeskyttelseslinjen',
      1,
      'Midlertidige hegn til dyrehold kan tillades i kortere perioder. Landbrugsmæssige hegn vurderes konkret.',
      'Faste hegn inden for strandbeskyttelseslinjen (300m fra kysten) kræver dispensation fra Kystdirektoratet. Strandbeskyttelseslinjens formål er at sikre fri adgang til kysten.',
      'Bøde og påbud om fjernelse for ejerens regning. Kystdirektoratet kan anlægge sag.',
      'Naturbeskyttelsesloven §15 (strandbeskyttelseslinje)',
      'DK',
    ],
    [
      'Hegnssyn (nabotvist om hegn)',
      1,
      null,
      'Hegnssyn foretages af lokale hegnssyn-mænd (udpeget af kommunen) ved nabotvist. Hegnssyn kan pålægge oprettelse, vedligeholdelse eller fjernelse af hegn. Afgørelse er bindende og kan ankes til Taksationskommissionen.',
      'Manglende efterlevelse af hegnssyn-afgørelse: bøde og kommunen kan lade arbejdet udføre for ejerens regning.',
      'Lov om hegn §28-§44',
      'DK',
    ],
    [
      'Randzoner langs vandløb og søer (hegn forbudt)',
      1,
      'Frivillig randzoneordning med tilskud. Randzoner kan kombineres med adgangsret.',
      'Langs vandløb og søer over 100 m2 skal der holdes en obligatorisk randzone på 2 meter fra øverste kant af vandløbet. Ingen sprøjtning, gødskning eller jordbehandling. Hegn langs vandløbskanten er i praksis ikke tilladt inden for randzonen.',
      'Bøde ved overtrædelse af randzonebekendtgørelsen. Landbrugsstyrelsen fører tilsyn.',
      'Naturbeskyttelsesloven §69a; Randzonebekendtgørelsen (BEK nr 96 af 27/01/2017)',
      'DK',
    ],
  ];

  for (const [action, notice, exemptions, criteria, penalties, ref, jur] of hedgerowData) {
    db.run(
      `INSERT INTO hedgerow_rules (action, notice_required, exemptions, important_hedgerow_criteria, penalties, regulation_ref, jurisdiction)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [action, notice, exemptions, criteria, penalties, ref, jur]
    );
  }

  // --- Felling Rules (Skovloven) ---
  // Source: Skovloven (LBK nr 315 af 28/03/2019)
  const fellingData: [string, number, number | null, number | null, string | null, string | null, string | null, string | null, string][] = [
    [
      'Fældning i fredskov',
      1,
      null,
      null,
      null,
      'Skovlovens §8: Fredskov skal bevares som skov. Fældning kræver at arealet tilplantes igen inden for rimelig tid (skovdyrkningspligt). Ansøgning om rydning (permanent omlægning) sendes til Naturstyrelsen.',
      'Bøde op til 10.000 DKK per overtrædelse. Påbud om genplantning. Omkostninger til retablering kan kræves af ejeren.',
      'Skovloven §8, §9, §12',
      'DK',
    ],
    [
      'Rydning af fredskov (permanent)',
      1,
      null,
      null,
      null,
      'Permanent rydning af fredskov kræver dispensation fra Naturstyrelsen. Gives kun i særlige tilfælde, f.eks. til vigtige samfundsformål. Alternativt kræves etablering af erstatningsskov af mindst tilsvarende størrelse.',
      'Ulovlig rydning: bøde og påbud om genplantning med erstatningsskov. Staten kan lade arbejdet udføre for ejerens regning.',
      'Skovloven §8, §11',
      'DK',
    ],
    [
      'Fældning af enkeltstående træer uden for fredskov',
      0,
      null,
      null,
      'Enkelttstående træer og hegn uden for registreret fredskov kræver normalt ikke tilladelse til fældning, medmindre de er: (a) fredet, (b) i §3-beskyttede naturtyper, (c) inden for fortidsmindebeskyttelseslinjen, (d) beskyttet af lokal kommuneplan eller fredning. Tjek med kommunen ved tvivl.',
      null,
      null,
      'Skovloven (gælder kun fredskov); Naturbeskyttelsesloven §3',
      'DK',
    ],
    [
      'Fældning af nødstedte (farlige) træer i fredskov',
      0,
      null,
      null,
      'Akut farlige træer i fredskov kan fældes uden forudgående tilladelse, hvis der er fare for persons eller ejendoms sikkerhed. Ejeren skal meddele Naturstyrelsen inden for 5 hverdage. Genplantningspligten gælder stadig.',
      'Meld til Naturstyrelsen inden for 5 hverdage. Dokumentér at træet var akut farligt.',
      null,
      'Skovloven §12; Skovlovens nødregler',
      'DK',
    ],
    [
      'Skovdyrkningspligt (genplantning efter fældning)',
      1,
      null,
      null,
      'Arealer, der er fældet i fredskov, skal tilplantes igen senest inden udgangen af den 3. vækstperiode efter fældning. Naturstyrelsen kan fastsætte betingelser for art, tæthed og etablering.',
      'Ansøg Naturstyrelsen om dispensation fra genplantningspligten, hvis naturlig foryngelse er ønsket. Naturlig foryngelse kan accepteres som alternativ til aktiv plantning efter konkret vurdering.',
      'Manglende genplantning: bøde og Naturstyrelsen kan lade arbejdet udføre for ejerens regning.',
      'Skovloven §9, §12',
      'DK',
    ],
    [
      'Skovrejsning (ny skov)',
      0,
      null,
      20.0,
      'Skovrejsning på arealer over 20 ha kræver VVM-screening (Vurdering af Virkninger på Miljøet). Skovrejsning er forbudt i visse zoner: strandbeskyttelseslinjen, omkring åbne naturtyper, i positive skovrejsningsområder gives tilskud.',
      'Ansøg om tilskud til skovrejsning via Landbrugsstyrelsen (Skovtilskudsordningen). Tilskud op til 50% af etableringsomkostningerne. Kræver 20-årig bindingsperiode.',
      null,
      'Skovloven §3; VVM-bekendtgørelsen; Skovtilskudsordningen',
      'DK',
    ],
    [
      'Juletræer og pyntegrøntplantager (ikke fredskov)',
      0,
      null,
      null,
      'Juletræsplantager og pyntegrøntplantager er ikke fredskov og er ikke underlagt skovlovens regler om skovdyrkningspligt. Fældning kræver ikke tilladelse. Dog gælder §3-beskyttelse, randzoner og andre naturbeskyttelsesregler.',
      null,
      null,
      'Skovloven §2 (undtaget fra skovlovens fredskovsbegreb)',
      'DK',
    ],
  ];

  for (const [scenario, lic, m3, ha, exemptions, process, penalties, ref, jur] of fellingData) {
    db.run(
      `INSERT INTO felling_rules (scenario, licence_required, threshold_m3, threshold_ha, exemptions, application_process, penalties, regulation_ref, jurisdiction)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [scenario, lic, m3, ha, exemptions, process, penalties, ref, jur]
    );
  }

  // --- §3 Nature Protection (replaces sssi_operations) ---
  // Source: Naturbeskyttelsesloven §3 og §4 (LBK nr 1392 af 04/10/2022)
  const sssiData: [string, number, string, string | null, string, string][] = [
    [
      'Dræning og vandstandssænkning i §3-arealer',
      1,
      'Søg dispensation hos kommunen. Kommunen vurderer indgrebet i forhold til §3-naturtypens tilstand og bevaringsstatus. Dispensation gives meget sjældent til irreversible indgreb som dræning.',
      'Evt. dispensation vil typisk kræve kompenserende foranstaltninger: vandstandshævning andetsteds, naturgenopretning, overvågning.',
      'Bøde op til 10.000 DKK. Påbud om retablering af vandstanden for ejerens regning. Kommunen kan anlægge sag.',
      'DK',
    ],
    [
      'Dyrkning og jordbehandling i §3-arealer',
      1,
      'Søg dispensation hos kommunen. Dyrkning af §3-beskyttede arealer er stærkt begrænset. Eksisterende lovlig dyrkning kan fortsættes, men udvidelse kræver dispensation.',
      'Evt. dispensation kræver bevis for at §3-tilstanden ikke forringes. Naturindholdet skal vurderes.',
      'Bøde og påbud om retablering. §3-arealets tilstand skal genoprettes for ejerens regning.',
      'DK',
    ],
    [
      'Gødskning af §3-arealer',
      1,
      'Søg dispensation hos kommunen. Gødskning af §3-beskyttede enge, heder og overdrev er generelt forbudt. Eksisterende gødskning kan muligvis fortsættes på visse arealer.',
      'Evt. dispensation kræver dokumentation for at gødskning ikke skader naturtypens tilstand og karakteristiske plantesamfund.',
      'Bøde op til 10.000 DKK. Påbud om at stoppe gødskning. Kommunen fører tilsyn.',
      'DK',
    ],
    [
      'Brug af pesticider i §3-arealer',
      1,
      'Søg dispensation hos kommunen. Brug af pesticider på §3-beskyttede arealer er generelt forbudt. Mekanisk bekæmpelse af invasive arter kan tillades.',
      'Evt. dispensation til invasive arteres bekæmpelse kræver godkendt plan og skånsomt middel.',
      'Bøde ved ulovlig sprøjtning. Påbud om retablering. Landbrugsstyrelsen og kommunen fører tilsyn.',
      'DK',
    ],
    [
      'Anlægsarbejde i §3-arealer (veje, bygninger, hegn)',
      1,
      'Søg dispensation hos kommunen. Dispensation gives sjældent til permanente anlæg i §3-arealer. Midlertidige anlæg som elledninger kan dispenseres med vilkår om retablering.',
      'Dispensationsbetingelser kan inkludere: tidsbegrænset tilladelse, krav om fuld retablering, kompenserende natur andetsteds.',
      'Bøde op til 10.000 DKK. Påbud om fjernelse for ejerens regning. Kommunen kan lade fjernelse udføre for ejerens regning.',
      'DK',
    ],
    [
      'Afbrænding i §3-arealer',
      1,
      'Kontrolleret afbrænding kan dispensationssøges hos kommunen i forvaltningsmæssige øjemed (hedepleje). Afbrænding i tørre perioder og på §3-arealer er generelt forbudt.',
      'Evt. dispensation kræver: aftale med brandvæsnet, afklaring af vind- og vejrforhold, sæsonbegrænsning.',
      'Brandstiftelse: strafferetlige sanktioner. Overtrædelse af §3: bøde og påbud om retablering.',
      'DK',
    ],
    [
      'Tilplantning i §3-arealer',
      1,
      'Tilplantning af eksisterende §3-natur er forbudt, da det ændrer naturtypens karakter. Naturlig tilgroning kan kontrolleres via slåning og afgræsning.',
      'Søg kommunens vejledning om pleje af §3-areal. Slåning og afgræsning til naturpleje er tilladt og ønskeligt.',
      'Ulovlig tilplantning: bøde. Påbud om fjernelse af ulovligt plantet vegetation for ejerens regning.',
      'DK',
    ],
    [
      '§3-registrering og dispensationsansøgning',
      0,
      'Kontroller om arealet er §3-registreret på miljoeportalen.dk. Registreringen er vejledende -- det er naturtilstanden der afgør, om §3-beskyttelse gælder, ikke registreringen. Ansøg om dispensation via kommunens digital platform.',
      null,
      null,
      'DK',
    ],
  ];

  for (const [op, consent, process, conditions, penalties, jur] of sssiData) {
    db.run(
      `INSERT INTO sssi_operations (operation, consent_required, process, typical_conditions, penalties, jurisdiction)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [op, consent, process, conditions, penalties, jur]
    );
  }

  // --- Rights of Way / Adgangsret ---
  // Source: Naturbeskyttelsesloven §14-§26 (adgangsretten til naturen)
  const rowData: [string, string, number, string | null, string, string, string][] = [
    [
      'Private skove (adgang til fods)',
      'Offentligheden har ret til at færdes til fods på alle stier og veje i private skove fra solopgang til solnedgang. Ejeren kan regulere adgangen på konkrete stier.',
      2.0,
      'Ridning og cykling er kun tilladt på afmærkede stier i private skove. Hunde skal være i snor i skoven 1. april til 30. september. Hunde skal i alle årets måneder holdes i snor, når de er i nærheden af vildtet.',
      'Ejere kan midlertidigt lukke stier i forbindelse med skovdrift, men offentligheden skal have adgang til skoven.',
      'Hindring af lovlig adgang er en overtrædelse af Naturbeskyttelsesloven. Kommunen fører tilsyn.',
      'DK',
    ],
    [
      'Strandbredder og kysten (adgang)',
      'Offentligheden har ret til at færdes til fods langs strandbredden. Adgang er tilladt inden for strandbeskyttelseslinjen (300m fra kysten). Badning og kortvarigt ophold er tilladt.',
      0,
      'Campering er ikke tilladt på stranden uden særlig tilladelse. Kørsel på stranden er forbudt undtagen på afmærkede steder. Hunde skal holdes i snor 1. april til 30. september.',
      'Ejere kan ikke afskærme adgangen til strandbredden. Politiet og kommunen kan gribe ind.',
      'Ulovlig afspærring af strandadgang: bøde og påbud om fjernelse af afspærring.',
      'DK',
    ],
    [
      'Overdrev, heder og strandenge (adgang)',
      'Offentligheden har ret til at færdes til fods og cykle på arealer med åbne naturtyper (overdrev, heder, strandenge) og åbne, udyrkede arealer. Retten gælder fra solopgang til solnedgang.',
      0,
      'Ridning er ikke tilladt på åbne naturarealer uden ejers tilladelse, medmindre det er afmærkede rideruter. Hunde skal holdes i snor i perioden 1. april til 30. september.',
      'Færdslen skal ske med respekt for naturen. Camping og bål er ikke tilladt på overdrev og heder.',
      'Ulovlig afspærring: bøde. Kommunen og SNS fører tilsyn.',
      'DK',
    ],
    [
      'Offentlige stier og markveje',
      'Offentlige stier og markveje (registreret i kommunens stiplan) er åbne for offentlig færdsel. Ejere må ikke spærre for adgangen. Stierne skal holdes i forsvarlig stand.',
      2.0,
      'Ejere er ansvarlige for at holde stier fri for afgrøder og forhindringer. Stier, der krydser dyrkede arealer, skal retableres inden for 14 dage efter forstyrrelse.',
      'Retablering af sti krævet inden for 14 dage efter forstyrrelse. Kommunen kan pålægge ejeren at retablere.',
      'Kriminel overtrædelse at spærre for offentlig stiadgang. Kommunen kan fjerne spærringer for ejerens regning.',
      'DK',
    ],
    [
      'Ridning på private arealer og i skove',
      'Ridning er kun tilladt på afmærkede ridestier i private skove. På åbne naturarealer er ridning ikke tilladt uden ejers samtykke, medmindre der er afmærkede rideruter. Ridning på offentlige stier (sti til fods) er ikke tilladt.',
      0,
      null,
      null,
      'Ridning på ulovlige arealer er en overtrædelse af Naturbeskyttelsesloven. Ejeren kan politianmelde ridning på privat grund.',
      'DK',
    ],
    [
      'Hunde i naturen (båndpligt)',
      'Hunde skal holdes i snor i perioden 1. april til 30. september i skove, på strandbredder og ved søer. Uden for denne periode skal hunde stadig holdes under kontrol, så de ikke jager vildt.',
      0,
      'Selv uden for båndpligtsperioden kan ejere kræve at hunde holdes i snor på private arealer. I §3-beskyttede naturtyper og fredede arealer kan der gælde særlige regler.',
      null,
      'Overtrædelse af båndpligten: bøde op til 1.000 DKK per hund per overtrædelse.',
      'DK',
    ],
    [
      'Campering og bål på private arealer',
      'Campering og bål på private naturarealer er som udgangspunkt forbudt uden ejers tilladelse. Offentlige shelteranlæg og lejrpladser er undtaget.',
      0,
      null,
      'Bål er forbudt i skove og i nærheden af plantager. Campering uden tilladelse er forbudt.',
      'Overtrædelse: bøde. Kommunen og politiet kan gribe ind.',
      'DK',
    ],
  ];

  for (const [pathType, obligation, width, cropping, reinstatement, obstruction, jur] of rowData) {
    db.run(
      `INSERT INTO rights_of_way (path_type, obligation, min_width_m, cropping_rules, reinstatement_deadline, obstruction_liability, jurisdiction)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [pathType, obligation, width, cropping, reinstatement, obstruction, jur]
    );
  }

  // --- Overdrev / Fællesarealer (Common Land Rules) ---
  // Source: Naturbeskyttelsesloven; Lov om fælles jagt og hegn
  const commonData: [string, number, string, string, string][] = [
    [
      'Dyrkning af overdrev og fællesarealer',
      1,
      'Kommunen (§3-dispensation); Landbrugsstyrelsen (landbrugspligt)',
      'Overdrev er beskyttet under §3 i Naturbeskyttelsesloven. Dyrkning kræver dispensation fra kommunen. Dispensation gives sjældent, da overdrev er sjælden og beskyttet naturtype. Ansøg skriftligt til kommunens naturforvaltning.',
      'DK',
    ],
    [
      'Hegning og afspærring af overdrev',
      1,
      'Kommunen og lodsejere',
      'Hegning af §3-beskyttede overdrev og fællesarealer kræver kommunens dispensation. Elektrisk afgræsningshegn til dyrehold kan accepteres, hvis det ikke hindrer offentlighedens adgang. Permanente hegn kræver dispensation og godkendelse.',
      'DK',
    ],
    [
      'Afgræsning af overdrev og åbne naturtyper',
      0,
      'Lodsejeren (ingen særlig tilladelse til afgræsning)',
      'Afgræsning er den vigtigste plejeform for overdrev og tilsvarende åbne naturtyper. Afgræsning kræver ikke dispensation fra §3-beskyttelsen, da det er med til at bevare naturtypens karakter. Tilskud til afgræsning kan søges via Landbrugsstyrelsen (Natura 2000-tilskud, §3-tilskud).',
      'DK',
    ],
    [
      'Offentlighedens adgang til overdrev og åbne naturarealer',
      0,
      'Naturbeskyttelsesloven (automatisk ret)',
      'Offentligheden har ret til at færdes til fods og cykle på åbne, udyrkede naturarealer (herunder overdrev, heder og strandenge) fra solopgang til solnedgang under Naturbeskyttelseslovens §24. Retten kan ikke fraviges af lodsejeren, medmindre der er særlig grund (f.eks. jagt eller skovdrift).',
      'DK',
    ],
    [
      'Ændring af arealanvendelse fra overdrev til markdrift',
      1,
      'Kommunen (§3-dispensation)',
      'Permanent omlægning af §3-beskyttet overdrev til markdrift er forbudt uden dispensation. Ansøg hos kommunen med dokumentation for arealets historik og nuværende naturtilstand. Kommunen vurderer om dispensation er forenelig med bevaringen af naturtypens karakter.',
      'DK',
    ],
  ];

  for (const [activity, consent, authority, process, jur] of commonData) {
    db.run(
      `INSERT INTO common_land_rules (activity, consent_required, consent_authority, process, jurisdiction)
       VALUES (?, ?, ?, ?, ?)`,
      [activity, consent, authority, process, jur]
    );
  }

  // --- Planting Guidance (Skovrejsning) ---
  // Source: Skovloven §3-§6; Skovtilskudsordningen; Miljøvurderingsloven
  const plantingData: [string, string, number | null, number, string, number, string][] = [
    [
      'Skovrejsning (ny løvskov)',
      'Løvtræer',
      2.0,
      0,
      'Tilskud via Landbrugsstyrelsens Skovtilskudsordning: op til 50% af godkendte etableringsomkostninger for private lodsejere. Tilskud kræver 20-årig bindingsperiode og godkendt driftsplan. VVM-screening kræves over 20 ha.',
      25,
      'DK',
    ],
    [
      'Skovrejsning (ny nåleskov)',
      'Nåletræer',
      2.0,
      0,
      'Lavere tilskud end løvskov. Nåleskov inden for negativt skovrejsningsområde (nær §3-natur, kystnærhed) gives ikke tilskud. Kontroller positivt/negativt skovrejsningsområde hos kommunen.',
      25,
      'DK',
    ],
    [
      'Skovrejsning nær vandmiljø (vandløb og søer)',
      'Brede- og elleskov',
      null,
      0,
      'Tilskud til brede- og elleskov langs vandløb og søer. Kantzoner til vandmiljøbeskyttelse. Randzone på min. 2m fra vandløbet kræves. Ingen gødskning eller sprøjtning i randzonen.',
      25,
      'DK',
    ],
    [
      'Agroforstbrug (skovlandbrug)',
      'Blandet',
      0.5,
      0,
      'Agroforstbrug kombinerer landbrug og skovbrug på samme areal. Tilskudsmuligheder under Landdistriktsprogrammet. Kræver godkendt plan. Skovdyrkningspligten gælder ikke for godkendte agroforstbrugssystemer.',
      25,
      'DK',
    ],
    [
      'Naturlig tilgroning (ingen plantning)',
      'Naturlig foryngelse',
      null,
      0,
      'Naturlig tilgroning med hjemmehørende arter kan accepteres som alternativ til aktiv plantning i skovrejsningsplaner, forudsat der er frøkilder i nærheden. Kræver godkendelse fra Naturstyrelsen. Overvågning kræves de første 5 år. Lavere tilskudssats end aktiv plantning.',
      25,
      'DK',
    ],
  ];

  for (const [purpose, species, minArea, eia, grant, buffer, jur] of plantingData) {
    db.run(
      `INSERT INTO planting_guidance (purpose, species_group, min_area_ha, eia_screening_required, grant_available, ancient_woodland_buffer_m, jurisdiction)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [purpose, species, minArea, eia, grant, buffer, jur]
    );
  }

  // --- Fredede træer / Skovbyggelinje (TPO equivalent) ---
  // Source: Naturbeskyttelsesloven §17; Kommunale fredninger
  const tpoData: [string, number, string, string | null, string, string, string, string][] = [
    [
      'Fældning af kommunalt fredede træer',
      1,
      'Kommunen (byggesagsafdeling eller naturforvaltning)',
      'Mindre beskæring til pleje kan i nogle kommuner udføres uden tilladelse. Kontroller den konkrete fredningskendelse.',
      'Ansøg kommunen om dispensation fra fredningskendelsen. Vedlæg arboristrapport. Kommunen vurderer om fældning er nødvendig (f.eks. ved fare for ejendom og person).',
      'Bøde for ulovlig fældning af fredet træ. Kommunen kan kræve erstatningsplantning.',
      'Kommunal fredningskendelse; Planloven; Naturbeskyttelsesloven §43',
      'DK',
    ],
    [
      'Bygning og anlæg i skovbyggelinjen (300m fra skov)',
      1,
      'Kommunen',
      'Landbrugets driftsbygninger og anlæg med direkte tilknytning til landbrugsdrift kan i visse tilfælde dispenseres. Primitive shelters og fugletårne tillades normalt.',
      'Søg landzonetilladelse og dispensation fra skovbyggelinjen hos kommunen. Begge tilladelser er normalt nødvendige. Kommunen vurderer det visuelle og rekreative hensyn til skoven.',
      'Bøde og påbud om nedrivning. Kommunen kan gennemtvinge fjernelse for ejerens regning.',
      'Naturbeskyttelsesloven §17 (skovbyggelinje)',
      'DK',
    ],
    [
      'Bygning og anlæg i fortidsmindebeskyttelseslinjen (100m fra fortidsminde)',
      1,
      'Kommunen',
      'Primitive rekreative anlæg nær fortidsmindet kan dispenseres. Landbrugets nødvendige driftsbygninger vurderes konkret.',
      'Søg dispensation hos kommunen. Vedlæg situationsplan og begrundelse. Kommunen høres om, om anlægget er til skade for den visuelle oplevelse og bevaring af fortidsmindet.',
      'Bøde og påbud om fjernelse. Kommunen kan lade fjernelse udføre for ejerens regning.',
      'Naturbeskyttelsesloven §18 (fortidsmindebeskyttelseslinje)',
      'DK',
    ],
    [
      'Fældning i nærheden af fredede fortidsminder',
      0,
      null,
      'Fældning af træer er normalt ikke begrænset af fortidsmindebeskyttelseslinjen, men større anlægsarbejde i forbindelse med rydning kan kræve tilladelse. Jordarbejde tæt på et fredet fortidsminde kræver altid forudgående tilladelse fra Kulturstyrelsen.',
      'Kontakt Kulturstyrelsen, hvis jordarbejde er nødvendigt i nærheden af fredede fortidsminder. Jordarbejde kan beskadige arkeologiske lag under markoverfladen.',
      'Skade på fredet fortidsminde: bøde og strafferetlig forfølgning. Kulturstyrelsen fører tilsyn.',
      'Museumslovens §29j; Naturbeskyttelsesloven §18',
      'DK',
    ],
  ];

  for (const [scenario, consent, authority, exemptions, process, penalties, ref, jur] of tpoData) {
    db.run(
      `INSERT INTO tpo_rules (scenario, consent_required, consent_authority, exemptions, process, penalties, regulation_ref, jurisdiction)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [scenario, consent, authority, exemptions, process, penalties, ref, jur]
    );
  }

  // --- FTS5 Search Index ---
  const ftsData: [string, string, string, string][] = [
    // Hegn
    ['Fjernelse af levende hegn (Hegnsloven)', 'Under Hegnsloven kræver fjernelse af levende hegn langs ejendomsgrænser naboens samtykke. Hegnssyn kan pålægge genplantning ved ulovlig fjernelse.', 'hedgerow', 'DK'],
    ['§3-beskyttede arealer og hegn', 'Hegn og indgreb i §3-beskyttede naturtyper (ferske enge, moser, heder, overdrev, strandenge) kræver dispensation fra kommunen. Dispensation gives sjældent til permanente anlæg.', 'hedgerow', 'DK'],
    ['Randzoner langs vandløb', 'Obligatorisk randzone på 2 meter langs vandløb og søer over 100 m2. Ingen sprøjtning, gødskning eller jordbehandling i randzonen. Hegn langs vandløbskanten er ikke tilladt inden for randzonen.', 'hedgerow', 'DK'],
    ['Hegn i strandbeskyttelseslinjen', 'Faste hegn inden for strandbeskyttelseslinjen (300m fra kysten) kræver dispensation fra Kystdirektoratet. Strandbeskyttelseslinjens formål er at sikre fri adgang til kysten.', 'hedgerow', 'DK'],
    ['Hegnssyn ved nabotvist', 'Hegnssyn foretages af lokale hegnssynsmænd udpeget af kommunen. Kan pålægge oprettelse, vedligeholdelse eller fjernelse af hegn. Afgørelse kan ankes til Taksationskommissionen.', 'hedgerow', 'DK'],
    ['Klipning af levende hegn ynglesæson', 'Klipning af levende hegn er tilladt hele året, men god landbrugspraksis anbefaler at undgå fuglenes ynglesæson (15. marts til 15. august). Naturbeskyttelseslovens §29 beskytter fugle og reder.', 'hedgerow', 'DK'],

    // Felling / Skovlov
    ['Fældning i fredskov (Skovloven)', 'Skovlovens §8: Fredskov skal bevares som skov. Fældning kræver genplantning inden for den 3. vækstperiode. Permanent rydning kræver dispensation fra Naturstyrelsen.', 'felling', 'DK'],
    ['Rydning af fredskov dispensation', 'Permanent rydning af fredskov kræver dispensation fra Naturstyrelsen og gives kun i særlige tilfælde, f.eks. til vigtige samfundsformål. Alternativt kræves erstatningsskov.', 'felling', 'DK'],
    ['Fældning af nødstedte træer i fredskov', 'Akut farlige træer i fredskov kan fældes uden forudgående tilladelse. Ejeren skal meddele Naturstyrelsen inden for 5 hverdage. Genplantningspligten gælder stadig.', 'felling', 'DK'],
    ['Skovdyrkningspligt genplantning', 'Arealer fældet i fredskov skal tilplantes igen senest inden udgangen af den 3. vækstperiode. Naturlig foryngelse kan accepteres som alternativ med Naturstyrelsens godkendelse.', 'felling', 'DK'],
    ['Skovrejsning VVM-screening', 'Skovrejsning på arealer over 20 ha kræver VVM-screening. Skovrejsning tilskud op til 50% af etableringsomkostningerne via Skovtilskudsordningen. Kræver 20-årig bindingsperiode.', 'felling', 'DK'],
    ['Fældning af enkelttstående træer uden for fredskov', 'Enkelttstående træer og hegn uden for registreret fredskov kræver normalt ikke tilladelse. Dog gælder §3-beskyttelse, fredede arealer og kommunale fredninger.', 'felling', 'DK'],
    ['Juletræer og pyntegrønt ikke fredskov', 'Juletræsplantager er ikke fredskov og er ikke underlagt skovlovens regler. Fældning kræver ikke tilladelse. Dog gælder §3-beskyttelse og randzoner.', 'felling', 'DK'],

    // §3-natur (SSSI equivalent)
    ['§3-beskyttede naturtyper dispensation', 'Naturbeskyttelseslovens §3 beskytter ferske enge, moser, heder, overdrev, strandenge og søer. Indgreb kræver dispensation fra kommunen. Dispensation gives sjældent til irreversible indgreb.', 'sssi', 'DK'],
    ['Dræning og vandstandssænkning §3', 'Dræning og vandstandssænkning i §3-arealer kræver dispensation fra kommunen. Dispensation gives meget sjældent til irreversible indgreb. Bøde og påbud om retablering ved overtrædelse.', 'sssi', 'DK'],
    ['Gødskning og sprøjtning §3-arealer', 'Gødskning og brug af pesticider på §3-beskyttede enge, heder og overdrev er generelt forbudt. Dispensation kræves og gives sjældent. Bøde og påbud om retablering.', 'sssi', 'DK'],
    ['Tilplantning i §3-natur forbudt', 'Tilplantning af §3-beskyttede naturtyper er forbudt, da det ændrer naturtypens karakter. Naturlig tilgroning håndteres via slåning og afgræsning som pleje.', 'sssi', 'DK'],
    ['§3-registrering på miljoeportalen', '§3-registreringen kan ses på miljoeportalen.dk. Registreringen er vejledende -- det er naturtilstanden, der afgør om §3-beskyttelse gælder. Ansøg om dispensation via kommunens digitale platform.', 'sssi', 'DK'],
    ['Anlægsarbejde og bygning i §3-arealer', 'Anlægsarbejde og permanente bygninger i §3-beskyttede naturtyper kræver dispensation fra kommunen. Dispensation gives sjældent. Bøde og påbud om fjernelse ved overtrædelse.', 'sssi', 'DK'],

    // Adgangsret (Rights of Way)
    ['Adgang til private skove (adgangsret)', 'Offentligheden har ret til at færdes til fods i private skove fra solopgang til solnedgang. Ridning og cykling kun på afmærkede stier. Hunde i snor 1. april til 30. september.', 'rights_of_way', 'DK'],
    ['Adgang til strandbredder', 'Offentligheden har ret til at færdes langs strandbredden inden for strandbeskyttelseslinjen (300m). Campering og kørsel på strand er forbudt. Badning og kortvarigt ophold er tilladt.', 'rights_of_way', 'DK'],
    ['Adgang til overdrev og heder', 'Offentligheden har ret til at færdes til fods og cykle på åbne naturarealer (overdrev, heder, strandenge) fra solopgang til solnedgang. Ridning kræver ejers tilladelse.', 'rights_of_way', 'DK'],
    ['Hunde båndpligt i naturen', 'Hunde skal holdes i snor i perioden 1. april til 30. september i skove, på strandbredder og ved søer. Bøde op til 1.000 DKK per overtrædelse. Ejere kan kræve snor på privat grund udenfor perioden.', 'rights_of_way', 'DK'],
    ['Offentlige stier og markveje', 'Offentlige stier og markveje er åbne for færdsel. Ejere er ansvarlige for vedligeholdelse. Retablering af sti kræves inden for 14 dage efter forstyrrelse ved markdrift.', 'rights_of_way', 'DK'],
    ['Ridning i naturen', 'Ridning er kun tilladt på afmærkede ridestier i private skove. På åbne naturarealer kræver ridning ejers samtykke. Ridning på offentlige stier (kun til fods) er ikke tilladt.', 'rights_of_way', 'DK'],

    // Overdrev / fællesarealer (Common land)
    ['Overdrev §3-beskyttelse og dyrkning', 'Overdrev er §3-beskyttet natur. Dyrkning kræver dispensation fra kommunen. Dispensation gives sjældent, da overdrev er sjælden naturtype. Afgræsning er tilladt og ønsket.', 'common_land', 'DK'],
    ['Afgræsning af overdrev (tilskud)', 'Afgræsning af overdrev kræver ikke dispensation og er den vigtigste plejeform. Tilskud kan søges via Landbrugsstyrelsen (Natura 2000-tilskud, §3-tilskud).', 'common_land', 'DK'],
    ['Adgang til overdrev og fællesarealer', 'Offentligheden har automatisk ret til at færdes til fods og cykle på åbne, udyrkede naturarealer under Naturbeskyttelseslovens §24 fra solopgang til solnedgang.', 'common_land', 'DK'],
    ['Hegning af overdrev', 'Hegning af §3-beskyttede overdrev og fællesarealer kræver kommunens dispensation. Elektrisk afgræsningshegn til dyrehold kan accepteres, hvis det ikke hindrer offentlighedens adgang.', 'common_land', 'DK'],

    // Skovrejsning (Planting)
    ['Skovrejsningstilskud løvskov', 'Tilskud til skovrejsning med løvskov op til 50% af godkendte etableringsomkostninger via Skovtilskudsordningen. Kræver 20-årig bindingsperiode og godkendt driftsplan.', 'planting', 'DK'],
    ['Skovrejsning VVM og negativt skovrejsningsområde', 'Skovrejsning over 20 ha kræver VVM-screening. Skovrejsning i negativt skovrejsningsområde (nær §3-natur, kystnærhed) gives ikke tilskud. Kontroller kortlægning hos kommunen.', 'planting', 'DK'],
    ['Brede- og elleskov langs vandløb', 'Tilskud til skovrejsning langs vandløb og søer med brede- og elleskov. Kantzoner til vandmiljøbeskyttelse. Randzone på min. 2m fra vandløbet kræves.', 'planting', 'DK'],
    ['Naturlig tilgroning alternativ til plantning', 'Naturlig tilgroning med hjemmehørende arter kan accepteres som alternativ til aktiv plantning i skovrejsningsplaner ved Naturstyrelsens godkendelse. Overvågning kræves de første 5 år.', 'planting', 'DK'],
    ['Agroforstbrug tilskud', 'Agroforstbrug kombinerer landbrug og skovbrug. Tilskudsmuligheder under Landdistriktsprogrammet. Kræver godkendt plan. Skovdyrkningspligten gælder ikke for godkendte agroforstbrugssystemer.', 'planting', 'DK'],

    // Fredede træer / Skovbyggelinje (TPO equivalent)
    ['Kommunalt fredede træer fældning', 'Fældning af kommunalt fredede træer kræver dispensation fra kommunen. Vedlæg arboristrapport. Bøde og krav om erstatningsplantning ved ulovlig fældning.', 'sssi', 'DK'],
    ['Skovbyggelinje 300m byggetilladelse', 'Bygning og anlæg inden for skovbyggelinjen (300m fra skov) kræver landzonetilladelse og dispensation fra kommunen. Skovbyggelinjen beskytter skovens visuelle og rekreative miljø.', 'planting', 'DK'],
    ['Fortidsmindebeskyttelseslinje 100m', 'Bygning og anlæg inden for 100m fra fredede fortidsminder kræver dispensation fra kommunen. Jordarbejde tæt på fortidsminder kræver forudgående tilladelse fra Kulturstyrelsen.', 'sssi', 'DK'],
  ];

  for (const [title, body, topic, jur] of ftsData) {
    db.run(
      `INSERT INTO search_index (title, body, topic, jurisdiction) VALUES (?, ?, ?, ?)`,
      [title, body, topic, jur]
    );
  }

  // --- Metadata ---
  db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('last_ingest', '2026-04-06')", []);
  db.run("INSERT OR REPLACE INTO db_metadata (key, value) VALUES ('build_date', '2026-04-06')", []);

  return db;
}
