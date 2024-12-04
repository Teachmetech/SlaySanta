import CommingSoonForm from "@/components/form/CommingSoonForm";
import Image from "next/image";
import Link from "next/link";
export const metadata = {
  title: 'Home || SlaySanta',
  description: `Tis' the season`,
}

const Home = () => {

  return (
    <>
      <div className="full-height-layout d-flex align-items-center">
        <div className="coming-soon-content font-gordita">
          <div className="logo coming-soon-brand">
            <Link href="/">
              <Image width="138" height="47" src="/images/logo/santaslay.svg" alt="brand logo" />
            </Link>
          </div>
          <h6>HO! HO! HO!</h6>
          <h1 data-aos="fade-up">Slide Into the Season with Secret Santa 🎁✨</h1>
          <div className="row">
            <div className="col-lg-9 m-auto">
              <p>
                Slay All Day, Swap All Night 🎅🎁
              </p>
            </div>
          </div>
          <CommingSoonForm />
          <p className="info-text">
            Need to make a Secret Santa? <Link href="login">Create one now!</Link>
          </p>
          <Image width={94} height={188}
            src="/images/shape/santa_1.svg"
            alt="shape"
            className="shapes shape-one"
          />
          <Image width={12} height={12}
            src="/images/shape/santa_2.svg"
            alt="shape"
            className="shapes shape-two"
          />
          <Image width={39} height={41}
            src="/images/shape/santa_3.svg"
            alt="shape"
            className="shapes shape-three"
          />
          <Image width={55} height={55}
            src="/images/shape/slay_1.svg"
            alt="shape"
            className="shapes shape-four"
          />
          <Image width={18} height={18}
            src="/images/shape/santa_4.svg"
            alt="shape"
            className="shapes shape-five"
          />
          <Image width={16} height={16}
            src="/images/shape/santa_5.svg"
            alt="shape"
            className="shapes shape-six"
          />
          <Image width={46} height={46}
            src="/images/shape/santa_6.svg"
            alt="shape"
            className="shapes shape-seven"
          />
          <Image width={25} height={25}
            src="/images/shape/santa_7.svg"
            alt="shape"
            className="shapes shape-eight"
          />
          <Image width={12} height={12}
            src="/images/shape/ball_1.svg"
            alt="shape"
            className="shapes shape-nine"
          />
          <Image width={233} height={111}
            src="/images/shape/cane_1.svg"
            alt="shape"
            className="shapes shape-ten"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
