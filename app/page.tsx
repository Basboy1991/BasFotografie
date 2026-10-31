import {pageMetadata} from './metadata';
import PublicPhoto from './components/public-photo';
import type {Metadata} from 'next';
import Link from 'next/link';
import HeroSlideshow from './components/hero-slideshow';
import {readContent} from './content';
import {type HomeBlock} from './home-blocks';
import {readHomeBlocks} from './home-blocks-data';
import {categories, getPortfolio, type CategorySlug} from './portfolio-data';
import {websiteGraph} from './site-schema';
import {jsonLd} from '../lib/structured-data.mjs';

export const dynamic = 'force-dynamic';

const services = [
  ['gezinnen', 'homeFamilyLabel', 'homeFamilyHeading', 'homeFamilyDescription', 'homeFamilyLink'],
  ['huisdieren', 'homePetsLabel', 'homePetsHeading', 'homePetsDescription', 'homePetsLink'],
  ['portretten', 'homePortraitsLabel', 'homePortraitsHeading', 'homePortraitsDescription', 'homePortraitsLink'],
] as const;

export async function generateMetadata():Promise<Metadata>{return pageMetadata('/',{absoluteTitle:true});}

export default async function Home() {
  const [{images, sample, heroSample, heroImages}, copy, blocks] = await Promise.all([
    getPortfolio(), readContent(), readHomeBlocks(),
  ]);
  const graph = websiteGraph();

  function render(block: HomeBlock) {
    if (block.type === 'core') {
      switch (block.id) {
        case 'hero':
          return (
            <section key={block.id} className="home-hero" aria-labelledby="home-heading">
              <div className="home-hero-scene">
                <HeroSlideshow images={heroImages} sample={heroSample}/>
                <div className="home-hero-copy">
                  <p className="eyebrow" data-edit-key="homeHeroEyebrow">{copy.homeHeroEyebrow}</p>
                  <h1 id="home-heading">
                    <span data-edit-key="homeHeroTop">{copy.homeHeroTop}</span>{' '}
                    <em data-edit-key="homeHeroBottom">{copy.homeHeroBottom}</em>
                  </h1>
                  <Link className="button home-hero-primary" href="/afspraak"><span data-edit-key="homeHeroButton">{copy.homeHeroButton}</span><span aria-hidden="true">↗</span></Link>
                </div>
              </div>
              <div className="home-hero-caption">
                <p data-edit-key="homeIntro">{copy.homeIntro}</p>
                <div className="home-hero-actions">
                  <Link className="text-link" href="/portfolio">Bekijk mijn werk <span aria-hidden="true">↗</span></Link>
                </div>
              </div>
            </section>
          );
        case 'portfolio':
          return (
            <section key={block.id} className="home-portfolio wrap" aria-labelledby="home-portfolio-heading">
              <div className="section-top">
                <div>
                  <p className="eyebrow" data-edit-key="homePortfolioEyebrow">{copy.homePortfolioEyebrow}</p>
                  <h2 id="home-portfolio-heading" data-edit-key="homePortfolioHeading">{copy.homePortfolioHeading}</h2>
                </div>
                <Link className="text-link" href="/portfolio" data-edit-key="homePortfolioLink">{copy.homePortfolioLink}</Link>
              </div>
              {sample && <p className="sample-note">Albums zonder eigen foto’s tonen gemarkeerde voorbeeldbeelden.</p>}
              <div className="home-albums">
                {(Object.keys(categories) as CategorySlug[]).map((slug, index) => (
                  <Link className={`home-album home-album-${slug}`} href={`/portfolio/${slug}`} key={slug}>
                    <div className="home-album-image">
                      <PublicPhoto src={images[index].url} alt={images[index].alt} focus={images[index].focus} sizes="(max-width: 680px) calc(100vw - 48px), 32vw" loading="lazy"/>
                    </div>
                    <div className="home-album-caption">
                      <h3>{categories[slug].label}</h3>
                      <span aria-hidden="true">↗</span>
                    </div>
                    <p>{images[index].title}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        case 'services':
          return (
            <section key={block.id} className="home-services" aria-labelledby="home-services-heading">
              <div className="wrap home-services-inner">
                <div className="home-services-intro">
                  <p className="eyebrow" data-edit-key="homeServicesEyebrow">{copy.homeServicesEyebrow}</p>
                  <h2 id="home-services-heading" data-edit-key="homeServicesHeading">{copy.homeServicesHeading}</h2>
                  <p data-edit-key="homeServicesIntro">{copy.homeServicesIntro}</p>
                  <Link className="text-link" href="/werkwijze">Zo werkt een shoot <span aria-hidden="true">↗</span></Link>
                </div>
                <div className="home-service-list">
                  {services.map(([slug, label, heading, description, link]) => (
                    <article key={slug}>
                      <p className="eyebrow" data-edit-key={label}>{copy[label]}</p>
                      <h3 data-edit-key={heading}>{copy[heading]}</h3>
                      <p data-edit-key={description}>{copy[description]}</p>
                      <Link className="text-link" href={`/diensten/${slug}`} data-edit-key={link}>{copy[link]}</Link>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        case 'closing':
          return (
            <section key={block.id} className="home-closing wrap" aria-labelledby="home-closing-heading">
              <div>
                <p className="eyebrow" data-edit-key="homeClosingEyebrow">{copy.homeClosingEyebrow}</p>
                <h2 id="home-closing-heading">
                  <span data-edit-key="homeClosingHeadingTop">{copy.homeClosingHeadingTop}</span>{' '}
                  <em data-edit-key="homeClosingHeadingBottom">{copy.homeClosingHeadingBottom}</em>
                </h2>
                <p data-edit-key="homeClosingIntro">{copy.homeClosingIntro}</p>
              </div>
              <div className="home-closing-actions">
                <Link className="text-link" href="/over-mij">Maak kennis met Bas <span aria-hidden="true">↗</span></Link>
                <Link className="text-link" href="/tarieven">Pakketten &amp; tarieven <span aria-hidden="true">↗</span></Link>
                <Link className="button" href="/afspraak">
                  <span data-edit-key="homeClosingButton">{copy.homeClosingButton}</span>
                </Link>
              </div>
            </section>
          );
      }
    }

    return (
      <section className="section wrap home-custom-block" key={block.id}>
        <div className={block.type === 'image' ? 'home-custom-image-layout' : undefined}>
          <div>
            <p className="eyebrow">Bas Fotografie</p>
            <h2>{block.heading}</h2>
            <p>{block.body}</p>
            {block.type === 'cta' && <Link className="button" href={block.href}>{block.button} ↗</Link>}
          </div>
          {block.type === 'image' && <PublicPhoto src={`/api/image/${block.imageKey}`} alt={block.alt} sizes="(max-width: 680px) calc(100vw - 48px), 45vw" loading="lazy"/>}
        </div>
      </section>
    );
  }

  return (
    <main className="home-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: jsonLd(graph)}}/>
      {blocks.map(render)}
    </main>
  );
}
